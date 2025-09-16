Param(
  [string] $Environment = 'sod',
  [int] [Parameter(Mandatory = $true)]$DotNetVersion,
  [switch] $ValidateOnly
)

Write-Output '', 'Start Deploy-DocsNext'

try {
  [Microsoft.Azure.Common.Authentication.AzureSession]::ClientFactory.AddUserAgent("VSAzureTools-$UI$($host.name)".replace(' ', '_'), '3.0.0')
}
catch { }

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 3

function Format-ValidationOutput {
  param ($ValidationOutput, [int] $Depth = 0)
  Set-StrictMode -Off
  return @($ValidationOutput | Where-Object { $_ -ne $null } | ForEach-Object { @('  ' * $Depth + ': ' + $_.Message) + @(Format-ValidationOutput @($_.Details) ($Depth + 1)) })
}

$ResourceGroupLocation = 'Norway East'
$ResourceGroupName = "rg-DocsNext-$($Environment)"
$TemplateFile = 'DocsNext.bicep'
$TemplateParametersFile = "DocsNext.$($Environment).parameters.json"


$TemplateFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $TemplateFile))
$TemplateParametersFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $TemplateParametersFile))

# Create the resource group only when it doesn't already exist
if ($null -eq (Get-AzResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -ErrorAction SilentlyContinue)) {
  New-AzResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -Force -ErrorAction Stop
}

if ($ValidateOnly) {
  $ErrorMessages = Format-ValidationOutput (Test-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName `
      -TemplateFile $TemplateFile `
      -TemplateParameterFile $TemplateParametersFile `
      @OptionalParameters)
  if ($ErrorMessages) {
    Write-Output '', 'Validation returned the following errors:', @($ErrorMessages), '', 'Template is invalid.'
    [Environment]::Exit(1)
  }
  Write-Output '', 'Template is valid.'
  Exit 0
}

$outputs = New-AzResourceGroupDeployment -Name ((Get-ChildItem $TemplateFile).BaseName + '-' + ((Get-Date).ToUniversalTime()).ToString('MMdd-HHmm')) `
  -ResourceGroupName $ResourceGroupName `
  -TemplateFile $TemplateFile `
  -environment $Environment `
  -TemplateParameterFile $TemplateParametersFile `
  -dotNetVersion $DotNetVersion `
  -Force -Verbose `
  -ErrorVariable ErrorMessages
if ($ErrorMessages) {
  Write-Output '', 'Template deployment returned the following errors:', @(@($ErrorMessages) | ForEach-Object { $_.Exception.Message.TrimEnd("`r`n") })
  [Environment]::Exit(1)
}

$WebAppName = $outputs.Outputs['webAppName'].value

Write-Host "##vso[task.setvariable variable=WebAppName;isOutput=true]$WebAppName"
Param(
  [string] $Environment = 'dev',
  [int] [Parameter(Mandatory = $true)]$DotNetVersion,
  [string] $SearchApiKey,
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
$ResourceGroupName = "rg-SuperOfficeDocs-$($Environment)"
$TemplateFile = 'SuperOfficeDocs.bicep'
$TemplateParametersFile = "Docs.$($Environment).parameters.json"


$TemplateFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $TemplateFile))

# Create the resource group only when it doesn't already exist
if ($null -eq (Get-AzResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -ErrorAction SilentlyContinue)) {
  New-AzResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -Force -ErrorAction Stop
}

if ($ValidateOnly) {
  $ErrorMessages = Format-ValidationOutput (Test-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName `
      -TemplateFile $TemplateFile `)
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
  -searchApiKey $SearchApiKey `
  -Force -Verbose `
  -ErrorVariable ErrorMessages
if ($ErrorMessages) {
  Write-Output '', 'Template deployment returned the following errors:', @(@($ErrorMessages) | ForEach-Object { $_.Exception.Message.TrimEnd("`r`n") })
  [Environment]::Exit(1)
}

$WebAppName = $outputs.Outputs['webAppName'].value
$KeyVaultName = $outputs.Outputs['keyVaultName'].value

if ($secrets.Count -gt 0 -and $KeyVaultName) {
  foreach ($secret in $secrets.PSObject.Properties) {
    Write-Output "Adding secret '$($secret.Name)' to Key Vault '$KeyVaultName'"
    Set-AzKeyVaultSecret -VaultName $KeyVaultName -Name $secret.Name -SecretValue (ConvertTo-SecureString $secret.Value -AsPlainText -Force) | Out-Null
  }
  Write-Output "Secrets added to Key Vault"
}
else {
  Write-Output "No secrets provided or Key Vault not found in outputs"
}

Write-Host "##vso[task.setvariable variable=WebAppName;isOutput=true]$WebAppName"
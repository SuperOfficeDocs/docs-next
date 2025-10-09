param location string = resourceGroup().location
@allowed([
  'dev'
  'stage'
  'prod'
])
param environment string
param dotNetVersion int
param appHostingPlan string = 'B1'
@secure()
param searchApiKey string
param docsUserGroupSid string

var webAppHostingPlanName = 'plan-superoffice-docs-${environment}'
var webAppName = 'app-superoffice-docs-${environment}'
var keyVaultName = 'kv-docs-${environment}'
var keyVaultSecrets = [
  {
    name: 'AzureSearch--ApiKey'
    value: searchApiKey
  }
]
var adGroupsWithKeyVaultAccessArray = [
  docsUserGroupSid
]

resource webAppHostingPlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: webAppHostingPlanName
  location: location
  tags: {
    displayName: 'Web App Hosting Plan'
  }
  sku: {
    name: appHostingPlan
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2024-11-01' = {
  name: webAppName
  location: location
  tags: {
    'hidden-related:${resourceGroup().id}/providers/Microsoft.Web/serverfarms/${webAppHostingPlanName}': 'Resource'
    displayName: '${webAppName} Web App'
  }
  kind: 'app,linux'
  properties: {
    serverFarmId: webAppHostingPlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|${dotNetVersion}.0'
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

resource webAppSettings 'Microsoft.Web/sites/config@2024-11-01' = {
  parent: webApp
  name: 'appsettings'
  properties: {
    WEBSITES_PORT: '8080'
    WEBSITE_RUN_FROM_PACKAGE: '1'
    keyVaultName: keyVaultName
  }
}

var getListSecretsPermissions = {
  secrets: [
    'get'
    'list'
  ]
}

resource keyVault 'Microsoft.KeyVault/vaults@2024-11-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: [for item in adGroupsWithKeyVaultAccessArray: {
      tenantId: subscription().tenantId
      objectId: item
      permissions: getListSecretsPermissions
    }]
  }
}

resource keyVaultSecretResources 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = [for keyVaultSecret in keyVaultSecrets: {
  parent: keyVault
  name: keyVaultSecret.name
  properties: {
    value: keyVaultSecret.value
  }
}]

resource keyVaultAccessPoliciesForApps 'Microsoft.KeyVault/vaults/accessPolicies@2024-11-01' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        objectId: webApp.identity.principalId
        permissions: getListSecretsPermissions
        tenantId: subscription().tenantId
      }
    ]
  }
}


output webAppName string = webAppName
output keyVaultName string = keyVaultName

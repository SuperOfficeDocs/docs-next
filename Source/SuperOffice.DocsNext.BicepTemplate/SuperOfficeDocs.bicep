param location string = resourceGroup().location
@allowed([
  'sod'
  'stage'
  'prod'
])
param environment string
param dotNetVersion int
param appHostingPlan string = 'B1'
var webAppHostingPlanName = 'plan-superoffice-docs-${environment}'
var webAppName = 'app-superoffice-docs-${environment}'


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
  }
}

output webAppName string = webAppName

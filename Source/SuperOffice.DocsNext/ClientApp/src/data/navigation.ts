export const headerData = {
  links: [
    {
      text: 'Learn',
      href: "en/learn"
    },
    {
      text: 'Integrations',
      href: "integrations"
    },
    {
      text: 'CRM Online',
      href: 'en/online',
    },
    {
      text: 'CRM Onsite',
      href: 'en/onsite',
    },
    {
      text: 'Developer Guide',
      links: [
        {
          text: 'Overview',
          href: 'en/api',
        },
        {
          text: 'Introduction to APIs',
          href: 'en/api/overview',
        },
        {
          text: 'Automaton / CRMScript',
          href: 'en/automation',
        },
        {
          text: 'Configurable screens (Sales)',
          href: 'en/ui/screen-designer/learn',
        },
        {
          text: 'Custom screens (Service)',
          href: 'en/ui/blogic/custom-screens',
        },
        {
          text: 'Database overview',
          href: 'en/database/getting-started',
        },
        {
          text: 'Developer Portal',
          href: 'en/developer-portal',
        },
        {
          text: 'Search APIs',
          href: 'en/api/netserver/search',
        },
        {
          text: 'Webhooks',
          href: 'en/automation/webhook',
        },
        {
          text: 'Web Services',
          href: 'en/api/netserver/web-services',
        },
      ],
    },
  ],
};

export const heroItems = {
  links: [
    {
      title: "Learn",
      description: "Product knowledge-base to learn concepts, features and solve issues.",
      icon: "mdi:learn-outline",
      url: "en/learn"
    },
    {
      title: "CRM Online",
      description: "Learn all about SuperOffice CRM offering for the cloud.",
      icon: "fluent:phone-laptop-32-regular",
      url: "en/online"
    },
    {
      title: "CRM Onsite",
      description: "Learn how to install SuperOffice in your on premise organization.",
      icon: "mdi:business",
      url: "en/onsite"
    },
    {
      title: "Release Notes",
      description: "Contains the history of product and API changes.",
      icon: "material-symbols-light:release-alert-outline",
      url: "release-notes"
    },
    {
      title: "SuperOffice APIs",
      description: "Introduction to all extensibility and integration points.",
      icon: "material-symbols-light:api",
      url: "en/api"
    },
    {
      title: "Developer Portal",
      description: "Learn how to create online applications.",
      icon: "material-symbols-light:developer-mode-tv-outline",
      url: "en/developer-portal"
    },
    {
      title: "Customer Service",
      description: "Learn all about SuperOffice Service.",
      icon: "material-symbols-light:support-agent-outline",
      url: "en/service"
    },
    {
      title: "Email and communication",
      description: "Great customer relations start with great communication.",
      icon: "mdi:email-outline",
      url: "en/email"
    }
  ],
};

export const areasOfInterest = {
  "links": [
    { "text": "Admin", "href": "en/admin" },
    { "text": "Artificial Intelligence", "href": "en/ai/learn" },
    { "text": "Automation", "href": "en/automation" },
    { "text": "Company", "href": "en/company" },
    { "text": "Contact", "href": "en/contact" },
    { "text": "CRMScript", "href": "en/automation/crmscript" },
    { "text": "Customer Service", "href": "en/service" },
    { "text": "Database Mirroring", "href": "en/online/mirroring/overview" },
    { "text": "Diary", "href": "en/diary" },
    { "text": "Document", "href": "en/document" },
    { "text": "Globalization", "href": "en/api/localization" },
    { "text": "Mobile", "href": "en/mobile" },
    { "text": "Project", "href": "en/project" },
    { "text": "Request Management", "href": "en/request" },
    { "text": "Sale", "href": "en/sale" },
    { "text": "Security", "href": "en/security" },
    { "text": "Video Meetings", "href": "integrations/video-meetings" },
    { "text": "WebTools", "href": "integrations/webtools" }
  ]
};


export const quickAccessShortcuts = {
  cards: [
    {
      title : "Getting Started",
      subLinks : [
        {
          title : "System requirements",
          link : `en/onsite/requirements`
        },
        {
          title : "Security concerns",
          link : `en/onsite/security`
        },
        {
          title : "Onsite topics",
          link : `en/onsite`
        },
        {
          title : "Online migration",
          link : `en/online/migrate`
        }
      ]
    },
    {
      title : "Installation",
      subLinks : [
        {
          title : "CRM Server",
          link : `en/onsite/install/server`
        },
        {
          title : "Web applications",
          link : `en/onsite/install/web-client`
        },
        {
          title : "Web tools",
          link : `integrations/webtools`
        },
        {
          title : "Mobile application",
          link : `en/mobile/overview`
        }
      ]
    },
    {
      title : "Configuration",
      subLinks : [
        {
          title : "NetServer Configuration",
          link : `en/api/config`
        },
        {
          title : "Document template variables",
          link : `en/document/templates/variables`
        },
        {
          title : "Service reply templates",
          link : `en/knowledge-base/learn/reply-templates`
        },
        {
          title : "Batch task service",
          link : `en/onsite/batch-task-server`
        },
        {
          title : "INI files",
          link : `en/onsite/config`
        }
      ]
    },
    {
      title : "Online development",
      subLinks : [
        {
          title : "Register online developer account",
          link : `en/developer-portal/getting-started/get-access-to-sod`
        },
        {
          title : "Developer portal",
          link : `https://dev.superoffice.com/`
        },
      ]
    },
  ]
};

export const footerData = {
  links: [
    { text: 'SuperOffice', href: 'https://www.superoffice.com/' },
    { text: 'Community', href: 'https://community.superoffice.com' },
    { text: 'Release Notes', href: `/release-notes` },
    { text: 'Privacy', href: 'https://www.superoffice.com/company/privacy/' },
    { text: 'Site feedback', href: 'https://github.com/SuperOfficeDocs/feedback/issues/new?title=Feedback%20for%20SuperOffice%20Docs&body=%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20docs.superOffice.com%20%E2%9E%9F%20Docs%20Team%20processing.*%0A%0A*%20Content%20Source%3A%20%5BSuperOffice%20Docs%5D(https%3A%2F%2Fdocs.superoffice.com)'},
    { text: 'About', href: `/about` },
    { text: 'Contribute', href:`/contribute/overview`},
    { text: 'Back to top', href:'#'}
  ],
};

export const audienceTypes = {
  audience: [
    {
      "title": "SuperUser",
      "description": "A person who has system administrative privilege's and special functional and data access rights for managing how SuperOffice behaves. The friend you need to tweak the system!",
      "href": `en/customization`,
      "color": "bg-seaFoamGreen"
    },
    {
      "title": "Administrator",
      "description": "A person who is primarily responsible for the setup, configuration, maintenance of operation of SuperOffice in an organization. The guy you call when shit hits the fan!",
      "href": `en/onsite`,
      "color": "bg-mistBlue"
    },
    {
      "title": "Consultant",
      "description": "A person who works with companies to improve their use of SuperOffice to achieve business goals and an expert in all technical aspects of SuperOffice. Hired to provide advice, solve problems and increase efficiency.",
      "href": `en/automation`,
      "color": "bg-lightTealGray"
    },
    {
      "title": "Developer",
      "description": "A software engineer responsible for the implementation of requirements for an application or integration, or provides advice (consultancy) as to how the an integration should be implemented using current industry trends.",
      "href": `en/api`,
      "color": "bg-deepTeal"
    }
  ],
};

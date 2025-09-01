const base = import.meta.env.BASE_URL;

export const audienceTypes = {
  audience: [
    {
      "title": "SuperUser",
      "description": "A person who has system administrative privilege's and special functional and data access rights for managing how SuperOffice behaves. The friend you need to tweak the system!",
      "href": `${base}/en/learn/customization`,
      "color": "bg-seaFoamGreen"
    },
    {
      "title": "Administrator",
      "description": "A person who is primarily responsible for the setup, configuration, maintenance of operation of SuperOffice in an organization. The guy you call when shit hits the fan!",
      "href": `${base}/en/onsite`,
      "color": "bg-mistBlue"
    },
    {
      "title": "Consultant",
      "description": "A person who works with companies to improve their use of SuperOffice to achieve business goals and an expert in all technical aspects of SuperOffice. Hired to provide advice, solve problems and increase efficiency.",
      "href": `${base}/en/automation`,
      "color": "bg-lightTealGray"
    },
    {
      "title": "Developer",
      "description": "A software engineer responsible for the implementation of requirements for an application or integration, or provides advice (consultancy) as to how the an integration should be implemented using current industry trends.",
      "href": `${base}/en/api`,
      "color": "bg-deepTeal"
    }
  ],
};
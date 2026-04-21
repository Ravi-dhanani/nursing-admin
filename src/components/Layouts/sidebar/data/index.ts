import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",

    items: [
      {
        title: "Courses",
        url: "/courses",
        icon: Icons.HomeIcon,
        items: [],
      },

      {
        title: "Content",
        icon: Icons.ContentIcon,
        items: [
          {
            title: "Materials",
            url: "/content/materials",
            icon: Icons.MaterialIcon,
          },
          {
            title: "Stores",
            url: "/content/stores",
            icon: Icons.StoreIcon,
          },
          {
            title: "Info",
            url: "/content/info",
            icon: Icons.InfoIcon,
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Icons.SettingIcon,
        items: [],
      },
      {
        title: "Help",
        url: "/help",
        icon: Icons.HelpIcon,
        items: [],
      },
      {
        title: "Logout",
        url: "/logout",
        icon: Icons.LogoutIcon,
        items: [],
      },
    ],
  },

  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

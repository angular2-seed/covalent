import { Component } from '@angular/core';
import { IMenuItem, IMenuTrigger } from '@covalent/core/dynamic-menu';

@Component({
  selector: 'dynamic-menu-demo-basic',
  styleUrls: ['./dynamic-menu-demo-basic.component.scss'],
  templateUrl: './dynamic-menu-demo-basic.component.html',
})
export class DynamicMenuDemoBasicComponent {
  trigger1: IMenuTrigger = {
    id: 'triggerbutton',
    icon: 'list',
    text: 'Trigger With Text And Icon',
  };

  items1: IMenuItem[] = [
    {
      id: 'covalentlinkstrigger',
      text: 'Covalent Links',
      svgIcon: 'assets:covalent',
      children: [
        {
          id: 'quickstartlink',
          text: 'Quickstart',
          icon: 'flash_on',
          link: 'https://github.com/Teradata/covalent-quickstart',
          newTab: true,
        },
        {
          id: 'electronlink',
          text: 'Electron App',
          icon: 'laptop_mac',
          link: 'https://github.com/Teradata/covalent-electron',
          newTab: true,
        },
        {
          id: 'datalink',
          text: 'Covalent Data',
          icon: 'aspect_ratio',
          link: 'https://github.com/Teradata/covalent-data',
          newTab: true,
        },
      ],
    },
    {
      id: 'angularlink',
      text: 'Angular Link',
      svgIcon: 'assets:angular',
      children: [
        {
          text: 'Angular Homepage',
          icon: 'star_rate',
          link: 'https://angular.io/',
          newTab: true,
        },
      ],
    },
  ];

  trigger2: IMenuTrigger = {
    icon: 'help',
  };

  items2: IMenuItem[] = [
    {
      text: 'Level 1',
      icon: 'filter_1',
      children: [
        {
          text: 'Level 2',
          icon: 'filter_2',
          children: [
            {
              text: 'Level 3',
              icon: 'filter_3',
              children: [
                {
                  text: 'Teradata - open in current tab',
                  icon: 'filter_4',
                  link: 'www.teradata.com',
                },
                {
                  text: 'Teradata - open in new tab',
                  icon: 'filter_4',
                  link: 'www.teradata.com',
                  newTab: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

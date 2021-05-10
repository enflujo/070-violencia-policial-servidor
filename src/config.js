import { timemap } from './lib'

export default {
  gsheets: [{
    name: 'gvp',
    path: process.env.GSHEET,
    tabs: timemap.prefixedTabs(false, false, [
      {
        name: 'eventos',
        format: 'deeprows',
      },
      {
        name: 'cais',
        format: 'rows',
      },
      {
        name: 'menus',
        format: 'columns',
      },
      {
        name: 'victimas',
        format: 'rows',
      },
      {
        name: '_ASSOCIATIONS_EXP',
        format: 'deeprows',
      },
    ]),
  }],
  // xlsx: [
  //   {
  //     name: 'timemap_data',
  //     path: 'data/timemap_data.xlsx',
  //     tabs: timemap.default
  //   }
  // ]
}

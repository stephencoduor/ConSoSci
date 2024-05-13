getValues(
  '1s7K3kxzm5AlpwiALattyc7D9_aIyqWmo2ubcQIUlqlY',
  'sheetsList of kobo forms!A:K',
  state => {
    const { koboForms, data } = state;
    const [headers, ...sheetsData] = data.values;
    const sheetsUids = sheetsData.map(row => row[0]);
    console.log('Ignoring headers', headers);

    state.filteredKoboFormsData = koboForms.filter(
      form => !sheetsUids.includes(form.uid)
    );
    state.data = {};
    state.references = [];
    return state;
  }
);

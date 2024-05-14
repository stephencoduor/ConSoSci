//Compare new forms in Kobo with GoogleSheet list to see if new forms were shared in Kobo
fn(state => {
  const { filteredKoboFormsData } = state;
  const keywords = ['price', 'prix', 'bns', 'nrgt', 'grm', 'feedback'];

  const tagMapping = {
    price: 'bns_price',
    prix: 'bns_price',
    bns: 'bns_survey',
    nrgt: 'nrgt_current',
    grm: 'grm',
    feedback: 'grm',
  };

  const createTagName = name => {
    let tag = '';
    const keyword = keywords.find(keyword =>
      name.toLowerCase().includes(keyword)
    );

    if (keyword) {
      tag = tagMapping[keyword] || keyword;
    }
    return tag;
  };

  const containsGRMFeedback = name =>
    name.toLowerCase().includes('grm', 'feedback');

  const instance = name =>
    containsGRMFeedback(name) ? '' : 'ADD MANUALLY @Admin!';

  const projectId = name =>
    containsGRMFeedback(name) ? 'ADD MANUALLY @Admin!' : '';

  const grmID = name => (containsGRMFeedback(name) ? 'GRM ID. XX' : '');

  const workspaceName = name =>
    containsGRMFeedback(name) ? 'Grievances' : 'ConSoSci';

  const status = 'deployed'; //if we assume only deployed forms will be fetched

  const currentDateTime = new Date().toISOString();

  const autoSync = false; 

  state.sheetsData = filteredKoboFormsData.map(form => {
    const formName = form.name;
    return [
      form.uid,
      form.name,
      createTagName(formName),
      form.owner__username,
      instance(formName),
      //projectId(formName), //for GRM only
      //grmID(formName), //for GRM only
      status, //deployment status
      workspaceName(formName), //openfn project space
      form.url,
      form.date_modified, //kobo_form_date_modified
      form.date_created, //kobo_form_date_created
      currentDateTime, //row_date_modified
      autoSync, //auto_sync checkbox
    ];
  });
  
  console.log('# of new forms detected:: ', state.sheetsData.length); 
  console.log('Forms to add to the master sheet:: ', state.sheetsData); 
  return state;
});

//if new Kobo form shared, adding to the Google Sheet... 
appendValues({
  spreadsheetId: '1s7K3kxzm5AlpwiALattyc7D9_aIyqWmo2ubcQIUlqlY', //sheet id
  range: 'wcs-bns-test!A:L', //range of columns in sheet
  values: state => state.sheetsData,
});

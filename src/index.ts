import fs from 'fs';

const filePath = 'prices.json';

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  const jsonData = JSON.parse(data) as Array<any>;
  const priceOnDemandEUC1 = getOnDemandPrice(jsonData, 'eu-central-1');

  console.log(priceOnDemandEUC1);
});

function getOnDemandPrice(pricingData: any[], region: string): number {
  const regionItem = pricingData.find(
    (item) => item.product?.attributes?.regionCode === region
  );
  if (!regionItem) {
    console.log(`No product found for region ${region}`);
    return -1;
  }
  if (!regionItem.terms?.OnDemand) {
    console.log(`Regional item has no OnDemand pricing`);
    return -1;
  }

  return Number(
    getNestedKey(regionItem.terms.OnDemand, 'pricePerUnit')?.USD || -1
  );
}

function getNestedKey(obj: any, key: string): any {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop === key) {
        return obj[prop];
      } else if (typeof obj[prop] === 'object') {
        const result = getNestedKey(obj[prop], key);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
}

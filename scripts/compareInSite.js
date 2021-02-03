rows = document.querySelectorAll('.table-wrapper tr');

ufopItem = {
  code: 'ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «А-Б'юті.Про»',
  code: 'ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «А-Б’юті.Про»',
  address: 'Україна, 61007, Харківська обл., місто Харків, пр.Олександрівський, будинок 87',
  Україна, 61115, Харківська обл., місто Харків, пр.Олександрівський, будинок 69 Д, квартира 164
  activity: '47.89 Роздрібна торгівля з лотків і на ринках іншими товарами',
  status: 'зареєстровано'
};

rowNumber = 999999;

for (let i = 0; i < rows.length; ++i) {
  for (let i = 0; i < rows.length; ++i) {
    if (ufopItem.isOrganization) {
      const [cellFullName, cellCode, cellAddress, cellStatus] = [
        rows[i].cells[0].textContent.toUpperCase().trim(),
        rows[i].cells[1].textContent.trim(),
        rows[i].cells[2].textContent.trim(),
        rows[i].cells[3].textContent.trim()
      ];

      if (ufopItem.fullName === cellFullName && ufopItem.code === cellCode
        && ufopItem.address === cellAddress && ufopItem.status === cellStatus) {
        rowNumber = i;
        break;
      }
    } else {
      const [cellFullName, cellAddress, cellStatus] = [
        rows[i].cells[0].textContent.toUpperCase().trim(),
        rows[i].cells[1].textContent.trim(),
        rows[i].cells[2].textContent.trim()
      ];

      if (ufopItem.fullName === cellFullName
        && ufopItem.status === cellStatus) {
        rowNumber = i;
        break;
      }
      // if (ufopItem.fullName === cellFullName && ufopItem.address === cellAddress
      //   && ufopItem.status === cellStatus) {
      //   rowNumber = i;
      //   break;
      // }
    }
  }
}

console.log('row', rowNumber);

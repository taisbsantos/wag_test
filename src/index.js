const xlsx = require('xlsx');

analysis = () =>{
   partners = readFile('Link Ids');

   partners.forEach((partner) => {
    data = readFile('Transactions');

    salesLink = sumSales(data, 'Link ID', partner.Link_ID)
    console.log('O parceiro ' + partner.Parceiro + ' vendeu pelo Link ID $' + salesLink[0] + ' totais')
    console.log('sendo $' + salesLink[1] + ' aprovados')
    console.log('e $' + salesLink[2] + ' reprovados')


    partnersVouchers = readFile('Voucher Codes');

    filteredVouchers = partnersVouchers
    .filter((linha) => linha['Parceiro'] === partner.Parceiro)
    .map((linha) => linha['Voucher Code']);

    filteredVouchers.forEach((code) => {
        salesVoucher = sumSales(data, 'Voucher Code', code)
        console.log('Com o código '+ code + ' foram vendidos $'+ salesVoucher[0])
        console.log('sendo $' + salesVoucher[1] + ' aprovados')
        console.log('e $' + salesVoucher[2] + ' reprovados')
    });

   })
}

readFile = (sheetName) => {
    const arquivo = '../files/sales.xlsx';

    const workbook = xlsx.readFile(arquivo);
    
    const worksheet = workbook.Sheets[sheetName];
    
    let data;

    data = xlsx.utils.sheet_to_json(worksheet);

    return data;

}


sumSales = (data, columnSheet, value ) => {

    let sumLinkId = 0;
    let sumApproved = 0;
    let sumRejected = 0;

    results = data.filter((transaction) => transaction[columnSheet] == value);
    results.map((result) => {
        sumLinkId = sumLinkId +  result['Revenue'];
    })

    resultsApproved = results.filter((transaction) => transaction['Status'] == 'Approved')
    resultsApproved.map((result) => {
        sumApproved = sumApproved +  result['Revenue'];
    })

    resultsRejected = results.filter((transaction) => transaction['Status'] == 'Rejected')
    resultsRejected.map((result) => {
        sumRejected = sumRejected +  result['Revenue'];
    })

    return [sumLinkId, sumApproved, sumRejected]
}

if (require.main === module) {
    analysis()
}

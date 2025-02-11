import * as cheerio from 'cheerio';
import { html, parseHTML } from 'cheerio/dist/commonjs/static';
import { table } from 'console';
import { JSDOM } from "jsdom";
// Types
export type PaymentHistory = {
  year: number;
  months: (0 | 1 | -1)[];
};

 export type AccountType = {
  bureau: string;
  dateOpen: string;
  name: string;
  accountNumber: string;
  balance: string;
  creditLimit: string;
  type: string;
  status: string;
  overviewPercentage: number;
  currentPaymentStatus : string,
  dateOfLastPayment : string;
  monthlyPayment : string;
  paymentHistory: PaymentHistory[];
};

export type CreditScore = {
  bureau: string;
  score: number;
  rating: string;
};

export type CreditDetail = {
  title: string;
  desc?: string;
  value: string;
  impact?: string;
  total?: number;
  used?: number;
};

export type CreditReport = {
  accounts: AccountType[];
  creditScores: CreditScore[];
  creditDetails: {
    [key : string] : {
      TransUnion : string,
      Experian : string,
      Equifax : string,
    }
  };
};



const extractCreditScores = ($: cheerio.CheerioAPI): CreditScore[] => {
  const scores: CreditScore[] = [];
  
  $('table.rpt_content_table tr').each((_, row) => {
    const cols = $(row).find('td');
    if (cols.length !== 4) return;

    const label = $(cols[0]).text().trim();
    if (label.includes('FICO® Score 8')) {
      ['TransUnion', 'Experian', 'Equifax'].forEach((bureau, idx) => {

        const score = parseInt($(cols[idx + 1]).text().trim());
        
        if (!isNaN(score)) {
          scores.push({
            bureau,
            score,
            rating: $(cols[idx + 1]).next('td').text().trim()
          });
        }
      });
    }
  });

  return scores;
};

const extractCreditDetails = ($ :cheerio.CheerioAPI) : any=> {
 // Find the Summary section
 const summarySection = $('#Summary').closest('.rpt_content_wrapper');

 // Find the table within the Summary section
 const table = summarySection.find('table.rpt_content_table.rpt_content_header.rpt_table4column');


  // Initialize the result object
  const result = {};

  // Extract headers (TransUnion, Experian, Equifax)
  const headers = [];
  table.find('th').each((index, element) => {
      const header = $(element).text().trim();
      if (header) {
          headers.push(header);
      }
  });

  // Extract rows and populate the result object
  table.find('tr').each((rowIndex, row) => {
      const label = $(row).find('td.label').text().trim();
      if (label) {
          result[label] = {};
          $(row).find('td.info').each((colIndex, col) => {
              const value = $(col).text().trim();
              result[label][headers[colIndex]] = value;
          });
      }
  });

  return result;


};

function organizeCreditStatus(years: string[], months: string[], statuses: string[]): { year: number; months: (1 | 0 | -1)[] }[] {
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearMap: Record<number, (1 | 0 | -1)[]> = {};
  
  // Initialize year map with default month statuses
  years.forEach(year => {
      const numericYear = parseInt(year, 10);
      if (!yearMap[numericYear]) {
          yearMap[numericYear] = new Array(12).fill(-1);
      }
  });
  
  // Populate year map with statuses
  for (let i = 0; i < years.length; i++) {
      const numericYear = parseInt(years[i], 10);
      const monthIndex = monthOrder.indexOf(months[i]);
      if (monthIndex !== -1) {
          yearMap[numericYear][monthIndex] = statuses[i] === 'OK' ? 1 : 0;
      }
  }
  
  // Convert to desired format
  return Object.entries(yearMap).map(([year, months]) => ({
      year: parseInt(year, 10),
      months
  })).sort((a, b) => b.year - a.year); // Sort descending by year
}

// Main parser function
export const parseCreditReport = (html: string): CreditReport => {
  const $ = cheerio.load(html);
  const accounts: AccountType[] = [];
  const creditScores = extractCreditScores($);
  
  const creditDetails = extractCreditDetails($);

  // Extract accounts (same as before)
  $('[ng-repeat="tLPartition in orderedTradeLines"]') .each((_, accountEl) => {
    const account = $(accountEl);
    const $accountNameEl = account.find('.sub_header.ng-binding.ng-scope')
    const name = $accountNameEl.text().trim()
    const bureauData = {
      TransUnion: { exists: false, data: {} as any },
      Experian: { exists: false, data: {} as any },
      Equifax: { exists: false, data: {} as any }
    };

    // Extract account details
    account.find('.rpt_content_table tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length !== 4) return;

      const field = $(cols[0]).text().trim().replace(':', '');
      
      ['TransUnion', 'Experian', 'Equifax'].forEach((bureau, idx) => {
        const value = $(cols[idx + 1]).text().trim();
        if (value && value !== '-') {
          bureauData[bureau as keyof typeof bureauData].exists = true;
          bureauData[bureau as keyof typeof bureauData].data[field] = value;
        }
      });
    });

    // Extract payment history
    const paymentHistoryTable = account.find('.addr_hsrty')

    let months : string[] = [];
    let years: string[] = [];
    let TransUnionStatuses : string[] = []
    let EquifaxStatuses : string[] = []
    let ExpiranStatuses : string[] = []
    paymentHistoryTable.find('tr').each((i, row) => {
      if(i===0){
        $(row).find('td').each((i, element) => {
          if(i !== 0){ 
            months.push($(element).text().trim())
          }
          
        })
      }else if (i === 1){
        $(row).find('td').each((i, element) => {
          if(i !== 0){
            years.push($(element).text().trim())
          }
          
        })

      }else if (i === 2){
        $(row).find('td').each((i, element) => {
          if(i !== 0){
            TransUnionStatuses.push($(element).text().trim())
          }
          
        })
      }
      else if (i === 3){
        $(row).find('td').each((i, element) => {
          if(i !== 0){
            EquifaxStatuses.push($(element).text().trim())
          }
          
        })
      }
      else if (i === 3){
        $(row).find('td').each((i, element) => {
          if(i !== 0){
            ExpiranStatuses.push($(element).text().trim())
          }
          
        })
      }
    })


    if(!paymentHistoryTable) return;
    
    // Create account instances for each bureau                                                       

    Object.entries(bureauData).forEach(([bureau, data]) => {
      if (!data.exists) return;
      let overviewPercentage;
      if(data.data['Balance'] && data.data['Credit Limit']){
        const balance = parseFloat(data.data['Balance'].replace(/[$,]/g, ''))
        const limit = parseFloat(data.data['Credit Limit'].replace(/[$,]/g, ''))
          console.log(balance, limit)
         let cach  = balance / limit;
         overviewPercentage = cach * 100;
      }
      accounts.push({
        bureau,
        dateOpen: data.data['Date Opened'] || '-',
        name: name || '-',
        accountNumber: data.data['Account #'] || '-',
        balance: data.data['Balance'] || '-',
        creditLimit: data.data['Credit Limit'] || '-',
        type: data.data['Account Type'] || '-',
        status: data.data['Account Status'] || '-',
        currentPaymentStatus : data.data['Payment Status'] || "-",
        dateOfLastPayment : data.data['Date of Last Payment'] || "-",
        monthlyPayment : data.data['Monthly Payment'] || "-",
        overviewPercentage: Number(overviewPercentage?.toFixed(1)) || 0, // Extract from payment progress
        paymentHistory: organizeCreditStatus(years, months, bureau === "Expiran" ? ExpiranStatuses : bureau === "Equifax" ? EquifaxStatuses : TransUnionStatuses)
      });

    });
  });

  return {
    accounts,
    creditScores,
    creditDetails
  };
};
import { ClientOrVehicle, LocalitySheet, Expense } from './types';

export const initialClientsAndVehicles: ClientOrVehicle[] = [
  {
    "id": "V01",
    "name": "JD7250",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-JD7250",
    "responsible": "-",
    "status": "Ativo",
    "rate": 800
  },
  {
    "id": "V02",
    "name": "LECÃO",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-LECÃO",
    "responsible": "-",
    "status": "Ativo",
    "rate": 120
  },
  {
    "id": "V03",
    "name": "CLAUDINEI 1620",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CLAUDINEI1620",
    "responsible": "-",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V04",
    "name": "CAMINHÃO",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CAMINHÃO",
    "responsible": "-",
    "status": "Ativo",
    "rate": 180
  },
  {
    "id": "V05",
    "name": "RAMOS SILAGEM - FR 9050",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-RAMOSSILAGEM-FR9050",
    "responsible": "-",
    "status": "Ativo",
    "rate": 0
  },
  {
    "id": "V06",
    "name": "CARGO 2425",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CARGO2425",
    "responsible": "-",
    "status": "Ativo",
    "rate": 0
  },
  {
    "id": "V07",
    "name": "CARGO 2631",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CARGO2631",
    "responsible": "-",
    "status": "Ativo",
    "rate": 0
  },
  {
    "id": "V08",
    "name": "CONSTELLATION",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CONSTELLATION",
    "responsible": "-",
    "status": "Ativo",
    "rate": 0
  },
  {
    "id": "V09",
    "name": "RAMOS SILAGEM - FR 700",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-RAMOSSILAGEM-FR700",
    "responsible": "-",
    "status": "Ativo",
    "rate": 900
  },
  {
    "id": "V10",
    "name": "MB EDUARDO",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-MBEDUARDO",
    "responsible": "Eduardo",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V11",
    "name": "MULA",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-MULA",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V12",
    "name": "CAWBOY",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-CAWBOY",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V13",
    "name": "CONSTELEITION",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-CONSTELEITION",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V14",
    "name": "CARRETA VW",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CARRETAVW",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V15",
    "name": "PÁ CARREGADEIRA",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-PÁCARREGADEIRA",
    "responsible": "-",
    "status": "Ativo",
    "rate": 280
  },
  {
    "id": "V16",
    "name": "2220 RODRIGO",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-2220RODRIGO",
    "responsible": "Rodrigo",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V17",
    "name": "2220 bigode",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-2220BIGODE",
    "responsible": "Bigode",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V18",
    "name": "COWBOY",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-COWBOY",
    "responsible": "Cowboy",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V19",
    "name": "2213 LEONIR mula",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-2213LEONIRMULA",
    "responsible": "Leonir",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V20",
    "name": "VOLKS 31 JOTA",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-VOLKS31JOTA",
    "responsible": "-",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V21",
    "name": "CONSTELLATION CHICO",
    "type": "Caminhão",
    "details": "Caminhão importado das planilhas",
    "plateOrFleet": "FROTA-CONSTELLATIONCHICO",
    "responsible": "Chico",
    "status": "Ativo",
    "rate": 120
  },
  {
    "id": "V22",
    "name": "Gago",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-GAGO",
    "responsible": "-",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V23",
    "name": "2220",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-2220",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  },
  {
    "id": "V24",
    "name": "1318 COWBOY",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-1318COWBOY",
    "responsible": "Cowboy",
    "status": "Ativo",
    "rate": 100
  },
  {
    "id": "V25",
    "name": "2213",
    "type": "Máquina",
    "details": "Máquina importado das planilhas",
    "plateOrFleet": "FROTA-2213",
    "responsible": "-",
    "status": "Ativo",
    "rate": 110
  }
];

export const initialLocalitySheets: LocalitySheet[] = [
  {
    "id": "rogerio-boa-esperança",
    "name": "Rogerio Boa esperança",
    "machines": [
      {
        "id": "M_1783694672625_21",
        "name": "JD7250",
        "ratePerHour": 800,
        "readings": {
          "18/jun": {
            "initial": "1521",
            "final": "1533"
          },
          "19/jun": {
            "initial": "1533",
            "final": "1546"
          },
          "20/jun": {
            "initial": "1546",
            "final": "1557"
          },
          "21/jun": {
            "initial": "1557",
            "final": "1567"
          },
          "22/jun": {
            "initial": "1567",
            "final": "1571"
          },
          "23/jun": {
            "initial": "1574",
            "final": "1575"
          }
        }
      },
      {
        "id": "M_1783694672625_31",
        "name": "LECÃO",
        "ratePerHour": 120,
        "readings": {
          "18/jun": {
            "initial": "1521",
            "final": "1533"
          },
          "19/jun": {
            "initial": "1533",
            "final": "1546"
          },
          "20/jun": {
            "initial": "1546",
            "final": "1557"
          },
          "21/jun": {
            "initial": "1557",
            "final": "1567"
          },
          "22/jun": {
            "initial": "1567",
            "final": "1571"
          },
          "23/jun": {
            "initial": "1574",
            "final": "1575"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "0",
            "final": "0"
          },
          "26/jun": {
            "initial": "0",
            "final": "0"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672625_65",
        "name": "CLAUDINEI 1620",
        "ratePerHour": 100,
        "readings": {
          "18/jun": {
            "initial": "1521",
            "final": "1533"
          },
          "19/jun": {
            "initial": "1533",
            "final": "1546"
          },
          "20/jun": {
            "initial": "1546",
            "final": "1557"
          },
          "21/jun": {
            "initial": "1557",
            "final": "1567"
          },
          "22/jun": {
            "initial": "1567",
            "final": "1570"
          },
          "23/jun": {
            "initial": "1574",
            "final": "1575"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "0",
            "final": "0"
          },
          "26/jun": {
            "initial": "0",
            "final": "0"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672625_74",
        "name": "CAMINHÃO",
        "ratePerHour": 180,
        "readings": {
          "18/jun": {
            "initial": "1521",
            "final": "1533"
          },
          "19/jun": {
            "initial": "1533",
            "final": "1546"
          },
          "20/jun": {
            "initial": "1546",
            "final": "1557"
          },
          "21/jun": {
            "initial": "1557",
            "final": "1567"
          },
          "22/jun": {
            "initial": "1567",
            "final": "1571"
          },
          "23/jun": {
            "initial": "1574",
            "final": "1575"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "0",
            "final": "0"
          },
          "26/jun": {
            "initial": "0",
            "final": "0"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "18/jun",
      "19/jun",
      "20/jun",
      "21/jun",
      "22/jun",
      "23/jun",
      "24/jun",
      "25/jun",
      "26/jun",
      "27/jun",
      "28/jun",
      "29/jun"
    ]
  },
  {
    "id": "pedagio-lavinia",
    "name": "Pedagio lavinia",
    "machines": [
      {
        "id": "M_1783694672626_32",
        "name": "JD7250",
        "ratePerHour": 800,
        "readings": {
          "01/jul": {
            "initial": "1580",
            "final": "1585"
          },
          "02/jul": {
            "initial": "1585",
            "final": "1591"
          },
          "03/jul": {
            "initial": "1591",
            "final": "1596"
          },
          "04/jul": {
            "initial": "1596",
            "final": "1607"
          }
        }
      },
      {
        "id": "M_1783694672626_12",
        "name": "LECÃO",
        "ratePerHour": 120,
        "readings": {
          "01/jul": {
            "initial": "1580",
            "final": "1585"
          },
          "02/jul": {
            "initial": "1585",
            "final": "1591"
          },
          "03/jul": {
            "initial": "1591",
            "final": "1596"
          },
          "04/jul": {
            "initial": "1596",
            "final": "1607"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          },
          "11/jul": {
            "initial": "0",
            "final": "0"
          },
          "12/jul": {
            "initial": "0",
            "final": "0"
          },
          "13/jul": {
            "initial": "0",
            "final": "0"
          },
          "14/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672626_19",
        "name": "CLAUDINEI 1620",
        "ratePerHour": 100,
        "readings": {
          "01/jul": {
            "initial": "1580",
            "final": "1585"
          },
          "02/jul": {
            "initial": "1585",
            "final": "1591"
          },
          "03/jul": {
            "initial": "1591",
            "final": "1596"
          },
          "04/jul": {
            "initial": "1596",
            "final": "1607"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          },
          "11/jul": {
            "initial": "0",
            "final": "0"
          },
          "12/jul": {
            "initial": "0",
            "final": "0"
          },
          "13/jul": {
            "initial": "0",
            "final": "0"
          },
          "14/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "01/jul",
      "02/jul",
      "03/jul",
      "04/jul",
      "05/jul",
      "06/jul",
      "07/jul",
      "08/jul",
      "09/jul",
      "10/jul",
      "11/jul",
      "12/jul",
      "13/jul",
      "14/jul"
    ]
  },
  {
    "id": "fechamento-04-05.06",
    "name": "Fechamento 04  05.06",
    "machines": [
      {
        "id": "M_1783694672661_30",
        "name": "RAMOS SILAGEM - FR 9050",
        "ratePerHour": 0,
        "readings": {
          "22/mai": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/mai": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/mai": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/mai": {
            "initial": "3318.18",
            "final": "3327.54"
          },
          "26/mai": {
            "initial": "3327.54",
            "final": "3333.94"
          },
          "27/mai": {
            "initial": "3333.94",
            "final": "3349.89"
          },
          "28/mai": {
            "initial": "3349.89",
            "final": "3357.95"
          },
          "29/mai": {
            "initial": "3358.41",
            "final": "3362.67"
          },
          "30/mai": {
            "initial": "3362.67",
            "final": "3373.15"
          },
          "01/jun": {
            "initial": "3373.15",
            "final": "3377.22"
          },
          "02/jun": {
            "initial": "3377.22",
            "final": "3386.54"
          },
          "03/jun": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/jun": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/jun": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      },
      {
        "id": "M_1783694672661_86",
        "name": "CARGO 2425",
        "ratePerHour": 0,
        "readings": {
          "22/mai": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/mai": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/mai": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/mai": {
            "initial": "3318.18",
            "final": "3327.54"
          },
          "26/mai": {
            "initial": "3327.54",
            "final": "3333.94"
          },
          "27/mai": {
            "initial": "3333.94",
            "final": "3349.89"
          },
          "28/mai": {
            "initial": "3349.89",
            "final": "3357.95"
          },
          "29/mai": {
            "initial": "3358.41",
            "final": "3362.67"
          },
          "30/mai": {
            "initial": "3362.67",
            "final": "3373.15"
          },
          "31/mai": {
            "initial": "0",
            "final": "0"
          },
          "01/jun": {
            "initial": "3373.15",
            "final": "3377.22"
          },
          "02/jun": {
            "initial": "3377.22",
            "final": "3386.54"
          },
          "03/jun": {
            "initial": "3386.58",
            "final": "0"
          },
          "04/jun": {
            "initial": "0",
            "final": "0"
          },
          "05/jun": {
            "initial": "0",
            "final": "0"
          },
          "06/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672661_17",
        "name": "CARGO 2631",
        "ratePerHour": 0,
        "readings": {
          "22/mai": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/mai": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/mai": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/mai": {
            "initial": "6860.84",
            "final": "6871.04"
          },
          "26/mai": {
            "initial": "6871.04",
            "final": "6881.1"
          },
          "27/mai": {
            "initial": "6881.1",
            "final": "6890.28"
          },
          "28/mai": {
            "initial": "6890.28",
            "final": "6901.53"
          },
          "29/mai": {
            "initial": "6901.53",
            "final": "6912.9"
          },
          "30/mai": {
            "initial": "6912.9",
            "final": "6922.06"
          },
          "31/mai": {
            "initial": "0",
            "final": "0"
          },
          "01/jun": {
            "initial": "6922.06",
            "final": "6932.84"
          },
          "02/jun": {
            "initial": "6932.84",
            "final": "6937.73"
          },
          "03/jun": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/jun": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/jun": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      },
      {
        "id": "M_1783694672661_34",
        "name": "CONSTELLATION",
        "ratePerHour": 0,
        "readings": {
          "22/mai": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/mai": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/mai": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/mai": {
            "initial": "6860.84",
            "final": "6871.04"
          },
          "26/mai": {
            "initial": "6871.04",
            "final": "6881.1"
          },
          "27/mai": {
            "initial": "6881.1",
            "final": "6890.28"
          },
          "28/mai": {
            "initial": "6890.28",
            "final": "6901.53"
          },
          "29/mai": {
            "initial": "6901.53",
            "final": "6912.9"
          },
          "30/mai": {
            "initial": "6912.9",
            "final": "6922.06"
          },
          "31/mai": {
            "initial": "0",
            "final": "0"
          },
          "01/jun": {
            "initial": "6922.06",
            "final": "6932.84"
          },
          "02/jun": {
            "initial": "6932.84",
            "final": "6937.73"
          },
          "03/jun": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/jun": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/jun": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      }
    ],
    "dates": [
      "22/mai",
      "23/mai",
      "24/mai",
      "25/mai",
      "26/mai",
      "27/mai",
      "28/mai",
      "29/mai",
      "30/mai",
      "31/mai",
      "01/jun",
      "02/jun",
      "03/jun",
      "04/jun",
      "05/jun",
      "06/jun",
      "07/jun",
      "08/jun",
      "09/jun",
      "10/jun"
    ]
  },
  {
    "id": "fechamen-to-05",
    "name": "Fechamen to 05",
    "machines": [
      {
        "id": "M_1783694672661_71",
        "name": "RAMOS SILAGEM - FR 9050",
        "ratePerHour": 0,
        "readings": {
          "06/jun": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/jun": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/jun": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "10/jun": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "11/jun": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/jun": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "16/jun": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "20/jun": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/jun": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/jun": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/jun": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "25/jun": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/jun": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/jun": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "29/jun": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "01/jul": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1783694672661_72",
        "name": "CARGO 2425",
        "ratePerHour": 0,
        "readings": {
          "06/jun": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/jun": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/jun": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "11/jun": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/jun": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "0",
            "final": "0"
          },
          "19/jun": {
            "initial": "0",
            "final": "0"
          },
          "20/jun": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/jun": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/jun": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/jun": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/jun": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/jun": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1783694672661_77",
        "name": "CARGO 2631",
        "ratePerHour": 0,
        "readings": {
          "06/jun": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/jun": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/jun": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "12/jun": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "0",
            "final": "0"
          },
          "19/jun": {
            "initial": "0",
            "final": "0"
          },
          "20/jun": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/jun": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/jun": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/jun": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/jun": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/jun": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1783694672661_43",
        "name": "CONSTELLATION",
        "ratePerHour": 0,
        "readings": {
          "06/jun": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/jun": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/jun": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/jun": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "0",
            "final": "0"
          },
          "19/jun": {
            "initial": "0",
            "final": "0"
          },
          "20/jun": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/jun": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/jun": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/jun": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          },
          "25/jun": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/jun": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/jun": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "06/jun",
      "07/jun",
      "08/jun",
      "09/jun",
      "10/jun",
      "11/jun",
      "12/jun",
      "13/jun",
      "14/jun",
      "15/jun",
      "16/jun",
      "17/jun",
      "18/jun",
      "19/jun",
      "20/jun",
      "21/jun",
      "22/jun",
      "23/jun",
      "24/jun",
      "25/jun",
      "26/jun",
      "27/jun",
      "28/jun",
      "29/jun",
      "30/jun",
      "01/jul"
    ]
  },
  {
    "id": "guaraci",
    "name": "GUARACI",
    "machines": [
      {
        "id": "M_1783694672773_11",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "23/mai": {
            "initial": "8954.8",
            "final": "8962.32"
          },
          "24/mai": {
            "initial": "8962.32",
            "final": "8969.03"
          },
          "25/mai": {
            "initial": "8969.05",
            "final": "8978.01"
          },
          "26/mai": {
            "initial": "8978.01",
            "final": "8985.96"
          }
        }
      },
      {
        "id": "M_1783694672773_0",
        "name": "MB EDUARDO",
        "ratePerHour": 110,
        "readings": {
          "23/mai": {
            "initial": "8954.8",
            "final": "8962.32"
          },
          "24/mai": {
            "initial": "8962.32",
            "final": "8969.03"
          },
          "25/mai": {
            "initial": "8969.05",
            "final": "8978.01"
          },
          "26/mai": {
            "initial": "8978.01",
            "final": "8985.96"
          },
          "27/mai": {
            "initial": "0",
            "final": "0"
          },
          "28/mai": {
            "initial": "0",
            "final": "0"
          },
          "29/mai": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672773_32",
        "name": "MULA",
        "ratePerHour": 110,
        "readings": {
          "23/mai": {
            "initial": "8954.8",
            "final": "8962.32"
          },
          "24/mai": {
            "initial": "8962.32",
            "final": "8969.03"
          },
          "25/mai": {
            "initial": "8969.05",
            "final": "8978.01"
          },
          "26/mai": {
            "initial": "8978.01",
            "final": "8985.96"
          },
          "27/mai": {
            "initial": "0",
            "final": "0"
          },
          "28/mai": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672773_88",
        "name": "CAWBOY",
        "ratePerHour": 110,
        "readings": {
          "23/mai": {
            "initial": "8954.8",
            "final": "8962.32"
          },
          "24/mai": {
            "initial": "8963.9",
            "final": "8969.03"
          },
          "25/mai": {
            "initial": "8969.05",
            "final": "8971.17"
          },
          "26/mai": {
            "initial": "8978.92",
            "final": "8982.63"
          },
          "27/mai": {
            "initial": "0",
            "final": "0"
          },
          "28/mai": {
            "initial": "0",
            "final": "0"
          },
          "29/mai": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672773_35",
        "name": "CONSTELEITION",
        "ratePerHour": 110,
        "readings": {
          "23/mai": {
            "initial": "8954.8",
            "final": "8962.32"
          },
          "24/mai": {
            "initial": "8963.9",
            "final": "8969.03"
          },
          "25/mai": {
            "initial": "8969.05",
            "final": "8978.01"
          },
          "26/mai": {
            "initial": "8978.01",
            "final": "8985.96"
          },
          "27/mai": {
            "initial": "0",
            "final": "0"
          },
          "28/mai": {
            "initial": "0",
            "final": "0"
          },
          "29/mai": {
            "initial": "0",
            "final": "0"
          },
          "30/mai": {
            "initial": "0",
            "final": "0"
          },
          "31/mai": {
            "initial": "0",
            "final": "0"
          },
          "01/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672773_4",
        "name": "CARRETA VW",
        "ratePerHour": 110,
        "readings": {
          "26/mai": {
            "initial": "8978.92",
            "final": "8982.63"
          },
          "27/mai": {
            "initial": "0",
            "final": "0"
          },
          "28/mai": {
            "initial": "0",
            "final": "0"
          },
          "29/mai": {
            "initial": "0",
            "final": "0"
          },
          "30/mai": {
            "initial": "0",
            "final": "0"
          },
          "31/mai": {
            "initial": "0",
            "final": "0"
          },
          "01/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "23/mai",
      "24/mai",
      "25/mai",
      "26/mai",
      "27/mai",
      "28/mai",
      "29/mai",
      "30/mai",
      "31/mai",
      "01/jun"
    ]
  },
  {
    "id": "taiaçu",
    "name": "TAIAÇU",
    "machines": [
      {
        "id": "M_1783694672774_74",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "29/mai": {
            "initial": "8989.55",
            "final": "8993.1"
          },
          "30/mai": {
            "initial": "8993.1",
            "final": "9003.17"
          },
          "31/mai": {
            "initial": "9003.17",
            "final": "9011.35"
          }
        }
      },
      {
        "id": "M_1783694672774_32",
        "name": "MB EDUARDO",
        "ratePerHour": 110,
        "readings": {
          "29/mai": {
            "initial": "8989.55",
            "final": "8993.1"
          },
          "30/mai": {
            "initial": "8993.1",
            "final": "9003.17"
          },
          "31/mai": {
            "initial": "9003.17",
            "final": "9011.35"
          }
        }
      },
      {
        "id": "M_1783694672774_34",
        "name": "MULA",
        "ratePerHour": 110,
        "readings": {
          "29/mai": {
            "initial": "8989.55",
            "final": "8993.1"
          },
          "30/mai": {
            "initial": "8993.1",
            "final": "9003.17"
          },
          "31/mai": {
            "initial": "9003.17",
            "final": "9011.35"
          }
        }
      },
      {
        "id": "M_1783694672774_38",
        "name": "CAWBOY",
        "ratePerHour": 110,
        "readings": {
          "29/mai": {
            "initial": "8989.55",
            "final": "8993.1"
          },
          "30/mai": {
            "initial": "8993.1",
            "final": "9003.17"
          },
          "31/mai": {
            "initial": "9003.17",
            "final": "9011.35"
          }
        }
      },
      {
        "id": "M_1783694672774_37",
        "name": "PÁ CARREGADEIRA",
        "ratePerHour": 280,
        "readings": {
          "29/mai": {
            "initial": "32871.1",
            "final": "32896.9"
          }
        }
      }
    ],
    "dates": [
      "29/mai",
      "30/mai",
      "31/mai"
    ]
  },
  {
    "id": "buritizal",
    "name": "BURITIZAL",
    "machines": [
      {
        "id": "M_1783694672775_49",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "1.78",
            "final": "1.78"
          },
          "05/jun": {
            "initial": "9041.53",
            "final": "9046.7"
          },
          "06/jun": {
            "initial": "9046.7",
            "final": "9057.3"
          },
          "07/jun": {
            "initial": "9057.3",
            "final": "9068.21"
          }
        }
      },
      {
        "id": "M_1783694672775_14",
        "name": "2220 RODRIGO",
        "ratePerHour": 110,
        "readings": {
          "02/jun": {
            "initial": "0",
            "final": "0"
          },
          "03/jun": {
            "initial": "0",
            "final": "0"
          },
          "04/jun": {
            "initial": "1.78",
            "final": "1.78"
          },
          "06/jun": {
            "initial": "0",
            "final": "0"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "05/jun": {
            "initial": "0",
            "final": "0"
          },
          "07/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672775_15",
        "name": "2220 bigode",
        "ratePerHour": 100,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "9033.61",
            "final": "9041.53"
          },
          "05/jun": {
            "initial": "9041.53",
            "final": "9046.7"
          },
          "06/jun": {
            "initial": "9046.7",
            "final": "9057.3"
          },
          "07/jun": {
            "initial": "9057.3",
            "final": "9068.21"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672775_20",
        "name": "COWBOY",
        "ratePerHour": 100,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "9033.61",
            "final": "9041.53"
          },
          "06/jun": {
            "initial": "9046.7",
            "final": "9057.3"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672775_20",
        "name": "2213 LEONIR mula",
        "ratePerHour": 110,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "9033.61",
            "final": "9041.53"
          },
          "06/jun": {
            "initial": "9046.7",
            "final": "9057.3"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672775_64",
        "name": "VOLKS 31 JOTA",
        "ratePerHour": 100,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "9033.61",
            "final": "9041.53"
          },
          "05/jun": {
            "initial": "9041.53",
            "final": "9046.7"
          },
          "07/jun": {
            "initial": "9057.3",
            "final": "9062.12"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672775_35",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 120,
        "readings": {
          "02/jun": {
            "initial": "9012.36",
            "final": "9020.92"
          },
          "03/jun": {
            "initial": "9020.92",
            "final": "9033.61"
          },
          "04/jun": {
            "initial": "9033.61",
            "final": "9041.53"
          },
          "05/jun": {
            "initial": "9041.53",
            "final": "9046.7"
          },
          "07/jun": {
            "initial": "9057.3",
            "final": "9068.21"
          },
          "08/jun": {
            "initial": "0",
            "final": "0"
          },
          "09/jun": {
            "initial": "0",
            "final": "0"
          },
          "10/jun": {
            "initial": "0",
            "final": "0"
          },
          "11/jun": {
            "initial": "0",
            "final": "0"
          },
          "12/jun": {
            "initial": "0",
            "final": "0"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "02/jun",
      "03/jun",
      "04/jun",
      "05/jun",
      "06/jun",
      "07/jun",
      "08/jun",
      "09/jun",
      "10/jun",
      "11/jun",
      "12/jun",
      "13/jun",
      "14/jun",
      "15/jun"
    ]
  },
  {
    "id": "sta-aracangua",
    "name": "STA Aracangua",
    "machines": [
      {
        "id": "M_1783694672776_54",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "09/jun": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/jun": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/jun": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/jun": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "18/jun": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/jun": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/jun": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/jun": {
            "initial": "9139.39",
            "final": "9145.8"
          }
        }
      },
      {
        "id": "M_1783694672776_5",
        "name": "2220 RODRIGO",
        "ratePerHour": 110,
        "readings": {
          "09/jun": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/jun": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/jun": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/jun": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "0",
            "final": "0"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/jun": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/jun": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/jun": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672776_32",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 120,
        "readings": {
          "09/jun": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/jun": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/jun": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/jun": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "0",
            "final": "0"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "9108.09",
            "final": "9111.41"
          },
          "19/jun": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/jun": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/jun": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672776_16",
        "name": "COWBOY",
        "ratePerHour": 100,
        "readings": {
          "09/jun": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/jun": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/jun": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/jun": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "0",
            "final": "0"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/jun": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/jun": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/jun": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672776_3",
        "name": "2213 LEONIR mula",
        "ratePerHour": 110,
        "readings": {
          "09/jun": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/jun": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/jun": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/jun": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "15/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "0",
            "final": "0"
          },
          "17/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/jun": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/jun": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/jun": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "09/jun",
      "10/jun",
      "11/jun",
      "12/jun",
      "13/jun",
      "14/jun",
      "15/jun",
      "16/jun",
      "17/jun",
      "18/jun",
      "19/jun",
      "20/jun",
      "21/jun",
      "22/jun"
    ]
  },
  {
    "id": "campanelli-capim",
    "name": "CAMPANELLI CAPIM",
    "machines": [
      {
        "id": "M_1783694672777_79",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "12/jun": {
            "initial": "9102.77",
            "final": "9106.95"
          }
        }
      },
      {
        "id": "M_1783694672777_16",
        "name": "Gago",
        "ratePerHour": 100,
        "readings": {
          "13/jun": {
            "initial": "0",
            "final": "0"
          },
          "14/jun": {
            "initial": "0",
            "final": "0"
          },
          "16/jun": {
            "initial": "0",
            "final": "0"
          },
          "18/jun": {
            "initial": "0",
            "final": "0"
          },
          "19/jun": {
            "initial": "0",
            "final": "0"
          },
          "20/jun": {
            "initial": "0",
            "final": "0"
          },
          "21/jun": {
            "initial": "0",
            "final": "0"
          },
          "22/jun": {
            "initial": "0",
            "final": "0"
          },
          "23/jun": {
            "initial": "0",
            "final": "0"
          },
          "24/jun": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "12/jun",
      "13/jun",
      "14/jun",
      "15/jun",
      "16/jun",
      "17/jun",
      "18/jun",
      "19/jun",
      "20/jun",
      "21/jun",
      "22/jun",
      "23/jun",
      "24/jun"
    ]
  },
  {
    "id": "gastão-vidigal",
    "name": "GASTÃO VIDIGAL",
    "machines": [
      {
        "id": "M_1783694672778_30",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "25/jun": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/jun": {
            "initial": "9152.95",
            "final": "9164.54"
          }
        }
      },
      {
        "id": "M_1783694672778_62",
        "name": "2220 RODRIGO",
        "ratePerHour": 110,
        "readings": {
          "25/jun": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/jun": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "0",
            "final": "0"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_16",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 120,
        "readings": {
          "25/jun": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/jun": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "0",
            "final": "0"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_65",
        "name": "COWBOY",
        "ratePerHour": 100,
        "readings": {
          "25/jun": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/jun": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "0",
            "final": "0"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_58",
        "name": "2213 LEONIR mula",
        "ratePerHour": 110,
        "readings": {
          "25/jun": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/jun": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/jun": {
            "initial": "0",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "0",
            "final": "0"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "25/jun",
      "26/jun",
      "27/jun",
      "28/jun",
      "29/jun",
      "30/jun",
      "01/jul",
      "02/jul",
      "03/jul"
    ]
  },
  {
    "id": "fazenda-monções",
    "name": "FAZENDA MONÇÕES",
    "machines": [
      {
        "id": "M_1783694672778_53",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "27/jun": {
            "initial": "9165.28",
            "final": "9172.74"
          },
          "28/jun": {
            "initial": "9172.74",
            "final": "9180.51"
          },
          "29/jun": {
            "initial": "9181.38",
            "final": "9184.17"
          },
          "30/jun": {
            "initial": "9184.84",
            "final": "9194.67"
          },
          "01/jul": {
            "initial": "9195.1",
            "final": "9200.26"
          }
        }
      },
      {
        "id": "M_1783694672778_90",
        "name": "2220",
        "ratePerHour": 110,
        "readings": {
          "27/jun": {
            "initial": "2.89",
            "final": "0"
          },
          "28/jun": {
            "initial": "0",
            "final": "0"
          },
          "29/jun": {
            "initial": "0",
            "final": "0"
          },
          "30/jun": {
            "initial": "0",
            "final": "0"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          },
          "01/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_72",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 120,
        "readings": {
          "27/jun": {
            "initial": "9165.28",
            "final": "9172.74"
          },
          "28/jun": {
            "initial": "9172.74",
            "final": "9180.51"
          },
          "29/jun": {
            "initial": "9181.38",
            "final": "9184.17"
          },
          "30/jun": {
            "initial": "9184.84",
            "final": "9194.67"
          },
          "01/jul": {
            "initial": "9195.1",
            "final": "9200.26"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_91",
        "name": "1318 COWBOY",
        "ratePerHour": 100,
        "readings": {
          "27/jun": {
            "initial": "9165.28",
            "final": "9172.74"
          },
          "28/jun": {
            "initial": "9172.74",
            "final": "9180.51"
          },
          "29/jun": {
            "initial": "9181.38",
            "final": "9184.17"
          },
          "30/jun": {
            "initial": "9184.84",
            "final": "9194.67"
          },
          "01/jul": {
            "initial": "9195.1",
            "final": "9200.26"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672778_12",
        "name": "2213",
        "ratePerHour": 110,
        "readings": {
          "27/jun": {
            "initial": "9165.28",
            "final": "9172.74"
          },
          "28/jun": {
            "initial": "9172.74",
            "final": "9180.51"
          },
          "29/jun": {
            "initial": "9181.38",
            "final": "9184.17"
          },
          "30/jun": {
            "initial": "9184.84",
            "final": "9194.67"
          },
          "01/jul": {
            "initial": "9195.1",
            "final": "9200.26"
          },
          "02/jul": {
            "initial": "0",
            "final": "0"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          },
          "07/jul": {
            "initial": "0",
            "final": "0"
          },
          "08/jul": {
            "initial": "0",
            "final": "0"
          },
          "09/jul": {
            "initial": "0",
            "final": "0"
          },
          "10/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "27/jun",
      "28/jun",
      "29/jun",
      "30/jun",
      "01/jul",
      "02/jul",
      "03/jul",
      "04/jul",
      "05/jul",
      "06/jul",
      "07/jul",
      "08/jul",
      "09/jul",
      "10/jul"
    ]
  },
  {
    "id": "fazenda-sargento-sebastinopolis",
    "name": "Fazenda sargento sebastinopolis",
    "machines": [
      {
        "id": "M_1783694672779_30",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 900,
        "readings": {
          "02/jul": {
            "initial": "9201.17",
            "final": "9211.61"
          }
        }
      },
      {
        "id": "M_1783694672779_79",
        "name": "2220",
        "ratePerHour": 120,
        "readings": {
          "02/jul": {
            "initial": "9201.17",
            "final": "9211.61"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672779_52",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 120,
        "readings": {
          "02/jul": {
            "initial": "9201.17",
            "final": "9211.61"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672779_49",
        "name": "1318 COWBOY",
        "ratePerHour": 100,
        "readings": {
          "02/jul": {
            "initial": "9201.17",
            "final": "9211.61"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1783694672779_46",
        "name": "2213",
        "ratePerHour": 110,
        "readings": {
          "02/jul": {
            "initial": "9201.17",
            "final": "9211.61"
          },
          "03/jul": {
            "initial": "0",
            "final": "0"
          },
          "04/jul": {
            "initial": "0",
            "final": "0"
          },
          "05/jul": {
            "initial": "0",
            "final": "0"
          },
          "06/jul": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "02/jul",
      "03/jul",
      "04/jul",
      "05/jul",
      "06/jul"
    ]
  }
];

export const initialExpenses: Expense[] = [
  {
    "id": "E_1783694672777_363",
    "date": "2026-06-11",
    "type": "diesel",
    "value": 6134.4,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_939",
    "date": "2026-06-18",
    "type": "diesel",
    "value": 6202.18,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_573",
    "date": "2026-06-20",
    "type": "diesel",
    "value": 7079.6,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_290",
    "date": "2026-06-21",
    "type": "diesel",
    "value": 5912.7,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_586",
    "date": "2026-06-22",
    "type": "diesel",
    "value": 782.5,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_874",
    "date": "2026-06-13",
    "type": "alimentação",
    "value": 2760,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_868",
    "date": "2026-06-20",
    "type": "alimentação",
    "value": 1000,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_1783694672777_407",
    "date": "2026-06-22",
    "type": "alimentação",
    "value": 2969,
    "localityName": "STA Aracangua"
  }
];

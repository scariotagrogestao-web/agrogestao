
import { ClientOrVehicle, LocalitySheet, Expense } from './types';

export const initialClientsAndVehicles: ClientOrVehicle[] = [
  {
    "id": "CV_1",
    "name": "RAMOS SILAGEM - FR 700",
    "type": "Máquina",
    "responsible": "Ramos"
  },
  {
    "id": "CV_2",
    "name": "2220 RODRIGO",
    "type": "Máquina",
    "responsible": "Rodrigo"
  },
  {
    "id": "CV_3",
    "name": "CONSTELLATION CHICO",
    "type": "Caminhão",
    "responsible": "Chico"
  },
  {
    "id": "CV_4",
    "name": "COWBOY",
    "type": "Máquina",
    "responsible": "Cowboy"
  },
  {
    "id": "CV_5",
    "name": "2213 LEONIR mula",
    "type": "Máquina",
    "responsible": "Leonir"
  },
  {
    "id": "CV_6",
    "name": "descrição",
    "type": "Máquina",
    "responsible": ""
  },
  {
    "id": "CV_7",
    "name": "Coluna3",
    "type": "Máquina",
    "responsible": ""
  },
  {
    "id": "CV_8",
    "name": "Coluna4",
    "type": "Máquina",
    "responsible": ""
  },
  {
    "id": "CV_9",
    "name": "Coluna5",
    "type": "Máquina",
    "responsible": ""
  },
  {
    "id": "CV_10",
    "name": "Gago",
    "type": "Máquina",
    "responsible": ""
  },
  {
    "id": "CV_11",
    "name": "RAMOS SILAGEM - FR 9050",
    "type": "Máquina",
    "responsible": "Ramos"
  },
  {
    "id": "CV_12",
    "name": "CARGO 2425",
    "type": "Caminhão",
    "responsible": ""
  },
  {
    "id": "CV_13",
    "name": "CARGO 2631",
    "type": "Caminhão",
    "responsible": ""
  },
  {
    "id": "CV_14",
    "name": "CONSTELLATION",
    "type": "Caminhão",
    "responsible": "Chico"
  },
  {
    "id": "CV_15",
    "name": "JD7250",
    "type": "Máquina",
    "responsible": "Bigode"
  },
  {
    "id": "CV_16",
    "name": "LECÃO",
    "type": "Máquina",
    "responsible": "Lecão"
  },
  {
    "id": "CV_17",
    "name": "CLAUDINEI 1620",
    "type": "Caminhão",
    "responsible": "Claudinei"
  },
  {
    "id": "CV_18",
    "name": "CAMINHÃO",
    "type": "Caminhão",
    "responsible": ""
  }
];

export const initialLocalitySheets: LocalitySheet[] = [
  {
    "id": "matriz",
    "name": "MATRIZ",
    "machines": [],
    "dates": []
  },
  {
    "id": "guaraci",
    "name": "GUARACI",
    "machines": [],
    "dates": []
  },
  {
    "id": "taiaçu",
    "name": "TAIAÇU",
    "machines": [],
    "dates": []
  },
  {
    "id": "buritizal",
    "name": "BURITIZAL",
    "machines": [],
    "dates": []
  },
  {
    "id": "sta-aracangua",
    "name": "STA Aracangua",
    "machines": [
      {
        "id": "M_1784136052834_26",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/06": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/06": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/06": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "18/06": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/06": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/06": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/06": {
            "initial": "9139.39",
            "final": "9145.8"
          }
        }
      },
      {
        "id": "M_1784136052834_18",
        "name": "2220 RODRIGO",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/06": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/06": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/06": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "0",
            "final": "0"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/06": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/06": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/06": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052834_22",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 180,
        "readings": {
          "09/06": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/06": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/06": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/06": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "0",
            "final": "0"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "9108.09",
            "final": "9111.41"
          },
          "19/06": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/06": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/06": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052834_36",
        "name": "COWBOY",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/06": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/06": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/06": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "0",
            "final": "0"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/06": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/06": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/06": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052834_63",
        "name": "2213 LEONIR mula",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "9070.69",
            "final": "9083.16"
          },
          "10/06": {
            "initial": "9083.16",
            "final": "9091.13"
          },
          "11/06": {
            "initial": "9091.13",
            "final": "9097.59"
          },
          "12/06": {
            "initial": "9097.59",
            "final": "9100.66"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "0",
            "final": "0"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "9108.09",
            "final": "9115.81"
          },
          "19/06": {
            "initial": "9115.96",
            "final": "9126.21"
          },
          "20/06": {
            "initial": "9126.99",
            "final": "9138.69"
          },
          "21/06": {
            "initial": "9139.39",
            "final": "9145.8"
          },
          "22/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052834_84",
        "name": "descrição",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "diesel",
            "final": "posto jumbo"
          },
          "10/06": {
            "initial": "diesel",
            "final": "posto jumbo"
          },
          "11/06": {
            "initial": "diesel",
            "final": "posto jumbo"
          },
          "12/06": {
            "initial": "diesel",
            "final": "posto jumbo"
          },
          "13/06": {
            "initial": "diesel",
            "final": "posto jumbo"
          },
          "14/06": {
            "initial": "hospedagem e alimentação",
            "final": "|Ruthe"
          },
          "15/06": {
            "initial": "hospedagem e alimentação",
            "final": "ruthe"
          },
          "16/06": {
            "initial": "hospedagem e alimentação",
            "final": "ruthe"
          }
        }
      },
      {
        "id": "M_1784136052834_75",
        "name": "Coluna3",
        "ratePerHour": 800,
        "readings": {
          "09/06": {
            "initial": "posto jumbo",
            "final": "6134.4"
          },
          "10/06": {
            "initial": "posto jumbo",
            "final": "6202.18"
          },
          "11/06": {
            "initial": "posto jumbo",
            "final": "7079.6"
          },
          "12/06": {
            "initial": "posto jumbo",
            "final": "5912.7"
          },
          "13/06": {
            "initial": "posto jumbo",
            "final": "782.5"
          },
          "14/06": {
            "initial": "|Ruthe",
            "final": "2760"
          },
          "15/06": {
            "initial": "ruthe",
            "final": "1000"
          },
          "16/06": {
            "initial": "ruthe",
            "final": "2969"
          }
        }
      },
      {
        "id": "M_1784136052834_77",
        "name": "Coluna4",
        "ratePerHour": 800,
        "readings": {}
      },
      {
        "id": "M_1784136052834_85",
        "name": "Coluna5",
        "ratePerHour": 800,
        "readings": {}
      }
    ],
    "dates": [
      "09/06",
      "10/06",
      "11/06",
      "12/06",
      "13/06",
      "14/06",
      "15/06",
      "16/06",
      "17/06",
      "18/06",
      "19/06",
      "20/06",
      "21/06",
      "22/06"
    ]
  },
  {
    "id": "campanelli-capim",
    "name": "CAMPANELLI CAPIM",
    "machines": [
      {
        "id": "M_1784136052836_59",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 800,
        "readings": {
          "12/06": {
            "initial": "9102.77",
            "final": "9106.95"
          }
        }
      },
      {
        "id": "M_1784136052836_72",
        "name": "Gago",
        "ratePerHour": 800,
        "readings": {
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "0",
            "final": "0"
          },
          "19/06": {
            "initial": "0",
            "final": "0"
          },
          "20/06": {
            "initial": "0",
            "final": "0"
          },
          "21/06": {
            "initial": "0",
            "final": "0"
          },
          "22/06": {
            "initial": "0",
            "final": "0"
          },
          "23/06": {
            "initial": "0",
            "final": "0"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "12/06",
      "13/06",
      "14/06",
      "15/06",
      "16/06",
      "17/06",
      "18/06",
      "19/06",
      "20/06",
      "21/06",
      "22/06",
      "23/06",
      "24/06"
    ]
  },
  {
    "id": "gastão-vidigal",
    "name": "GASTÃO VIDIGAL",
    "machines": [
      {
        "id": "M_1784136052836_36",
        "name": "RAMOS SILAGEM - FR 700",
        "ratePerHour": 800,
        "readings": {
          "25/06": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/06": {
            "initial": "9152.95",
            "final": "9164.54"
          }
        }
      },
      {
        "id": "M_1784136052836_43",
        "name": "2220 RODRIGO",
        "ratePerHour": 800,
        "readings": {
          "25/06": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/06": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "0",
            "final": "0"
          },
          "02/07": {
            "initial": "0",
            "final": "0"
          },
          "03/07": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052836_10",
        "name": "CONSTELLATION CHICO",
        "ratePerHour": 180,
        "readings": {
          "25/06": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/06": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "0",
            "final": "0"
          },
          "02/07": {
            "initial": "0",
            "final": "0"
          },
          "03/07": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052836_70",
        "name": "COWBOY",
        "ratePerHour": 800,
        "readings": {
          "25/06": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/06": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "0",
            "final": "0"
          },
          "02/07": {
            "initial": "0",
            "final": "0"
          },
          "03/07": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052836_80",
        "name": "2213 LEONIR mula",
        "ratePerHour": 800,
        "readings": {
          "25/06": {
            "initial": "9146.73",
            "final": "9152.95"
          },
          "26/06": {
            "initial": "9152.95",
            "final": "9164.54"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "0",
            "final": "0"
          },
          "02/07": {
            "initial": "0",
            "final": "0"
          },
          "03/07": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "25/06",
      "26/06",
      "27/06",
      "28/06",
      "29/06",
      "30/06",
      "01/07",
      "02/07",
      "03/07"
    ]
  },
  {
    "id": "fazenda-monções",
    "name": "FAZENDA MONÇÕES",
    "machines": [],
    "dates": []
  },
  {
    "id": "fazenda-sargento-sebastinopolis",
    "name": "Fazenda sargento sebastinopolis",
    "machines": [],
    "dates": []
  },
  {
    "id": "acerto",
    "name": "Acerto",
    "machines": [],
    "dates": []
  },
  {
    "id": "fechamento-04-05.06",
    "name": "Fechamento 04  05.06",
    "machines": [
      {
        "id": "M_1784136052869_24",
        "name": "RAMOS SILAGEM - FR 9050",
        "ratePerHour": 900,
        "readings": {
          "22/05": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/05": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/05": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/05": {
            "initial": "3318.18",
            "final": "3327.54"
          },
          "26/05": {
            "initial": "3327.54",
            "final": "3333.94"
          },
          "27/05": {
            "initial": "3333.94",
            "final": "3349.89"
          },
          "28/05": {
            "initial": "3349.89",
            "final": "3357.95"
          },
          "29/05": {
            "initial": "3358.41",
            "final": "3362.67"
          },
          "30/05": {
            "initial": "3362.67",
            "final": "3373.15"
          },
          "01/06": {
            "initial": "3373.15",
            "final": "3377.22"
          },
          "02/06": {
            "initial": "3377.22",
            "final": "3386.54"
          },
          "03/06": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/06": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/06": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      },
      {
        "id": "M_1784136052869_58",
        "name": "CARGO 2425",
        "ratePerHour": 120,
        "readings": {
          "22/05": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/05": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/05": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/05": {
            "initial": "3318.18",
            "final": "3327.54"
          },
          "26/05": {
            "initial": "3327.54",
            "final": "3333.94"
          },
          "27/05": {
            "initial": "3333.94",
            "final": "3349.89"
          },
          "28/05": {
            "initial": "3349.89",
            "final": "3357.95"
          },
          "29/05": {
            "initial": "3358.41",
            "final": "3362.67"
          },
          "30/05": {
            "initial": "3362.67",
            "final": "3373.15"
          },
          "31/05": {
            "initial": "0",
            "final": "0"
          },
          "01/06": {
            "initial": "3373.15",
            "final": "3377.22"
          },
          "02/06": {
            "initial": "3377.22",
            "final": "3386.54"
          },
          "03/06": {
            "initial": "3386.58",
            "final": "0"
          },
          "04/06": {
            "initial": "0",
            "final": "0"
          },
          "05/06": {
            "initial": "0",
            "final": "0"
          },
          "06/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052869_9",
        "name": "CARGO 2631",
        "ratePerHour": 120,
        "readings": {
          "22/05": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/05": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/05": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/05": {
            "initial": "6860.84",
            "final": "6871.04"
          },
          "26/05": {
            "initial": "6871.04",
            "final": "6881.1"
          },
          "27/05": {
            "initial": "6881.1",
            "final": "6890.28"
          },
          "28/05": {
            "initial": "6890.28",
            "final": "6901.53"
          },
          "29/05": {
            "initial": "6901.53",
            "final": "6912.9"
          },
          "30/05": {
            "initial": "6912.9",
            "final": "6922.06"
          },
          "31/05": {
            "initial": "0",
            "final": "0"
          },
          "01/06": {
            "initial": "6922.06",
            "final": "6932.84"
          },
          "02/06": {
            "initial": "6932.84",
            "final": "6937.73"
          },
          "03/06": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/06": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/06": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      },
      {
        "id": "M_1784136052869_63",
        "name": "CONSTELLATION",
        "ratePerHour": 120,
        "readings": {
          "22/05": {
            "initial": "6832.5",
            "final": "6843.54"
          },
          "23/05": {
            "initial": "6843.54",
            "final": "6852.13"
          },
          "24/05": {
            "initial": "6852.13",
            "final": "6860.84"
          },
          "25/05": {
            "initial": "6860.84",
            "final": "6871.04"
          },
          "26/05": {
            "initial": "6871.04",
            "final": "6881.1"
          },
          "27/05": {
            "initial": "6881.1",
            "final": "6890.28"
          },
          "28/05": {
            "initial": "6890.28",
            "final": "6901.53"
          },
          "29/05": {
            "initial": "6901.53",
            "final": "6912.9"
          },
          "30/05": {
            "initial": "6912.9",
            "final": "6922.06"
          },
          "31/05": {
            "initial": "0",
            "final": "0"
          },
          "01/06": {
            "initial": "6922.06",
            "final": "6932.84"
          },
          "02/06": {
            "initial": "6932.84",
            "final": "6937.73"
          },
          "03/06": {
            "initial": "6937.73",
            "final": "6944.07"
          },
          "04/06": {
            "initial": "6944.07",
            "final": "6953.09"
          },
          "05/06": {
            "initial": "6954.37",
            "final": "6961.67"
          }
        }
      }
    ],
    "dates": [
      "22/05",
      "23/05",
      "24/05",
      "25/05",
      "26/05",
      "27/05",
      "28/05",
      "29/05",
      "30/05",
      "31/05",
      "01/06",
      "02/06",
      "03/06",
      "04/06",
      "05/06",
      "06/06",
      "07/06",
      "08/06",
      "09/06",
      "10/06"
    ]
  },
  {
    "id": "fechamen-to-05",
    "name": "Fechamen to 05",
    "machines": [
      {
        "id": "M_1784136052870_47",
        "name": "RAMOS SILAGEM - FR 9050",
        "ratePerHour": 900,
        "readings": {
          "06/06": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/06": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/06": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "10/06": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "11/06": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/06": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "16/06": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "20/06": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/06": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/06": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/06": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "25/06": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/06": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/06": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "29/06": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "01/07": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1784136052870_96",
        "name": "CARGO 2425",
        "ratePerHour": 120,
        "readings": {
          "06/06": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/06": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/06": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/06": {
            "initial": "0",
            "final": "0"
          },
          "10/06": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "11/06": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/06": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "0",
            "final": "0"
          },
          "19/06": {
            "initial": "0",
            "final": "0"
          },
          "20/06": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/06": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/06": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/06": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/06": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/06": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1784136052870_60",
        "name": "CARGO 2631",
        "ratePerHour": 120,
        "readings": {
          "06/06": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/06": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/06": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/06": {
            "initial": "0",
            "final": "0"
          },
          "10/06": {
            "initial": "6987.4",
            "final": "6991.37"
          },
          "12/06": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "0",
            "final": "0"
          },
          "19/06": {
            "initial": "0",
            "final": "0"
          },
          "20/06": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/06": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/06": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/06": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/06": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/06": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          },
          "01/07": {
            "initial": "7079.96",
            "final": "7089.67"
          }
        }
      },
      {
        "id": "M_1784136052870_23",
        "name": "CONSTELLATION",
        "ratePerHour": 120,
        "readings": {
          "06/06": {
            "initial": "6961.67",
            "final": "6970.96"
          },
          "07/06": {
            "initial": "6970.96",
            "final": "6980.29"
          },
          "08/06": {
            "initial": "6980.29",
            "final": "6987.4"
          },
          "09/06": {
            "initial": "0",
            "final": "0"
          },
          "11/06": {
            "initial": "6991.37",
            "final": "6999.04"
          },
          "12/06": {
            "initial": "6999.04",
            "final": "7007.91"
          },
          "13/06": {
            "initial": "0",
            "final": "0"
          },
          "14/06": {
            "initial": "0",
            "final": "0"
          },
          "15/06": {
            "initial": "0",
            "final": "0"
          },
          "16/06": {
            "initial": "7007.91",
            "final": "7014.03"
          },
          "17/06": {
            "initial": "0",
            "final": "0"
          },
          "18/06": {
            "initial": "0",
            "final": "0"
          },
          "19/06": {
            "initial": "0",
            "final": "0"
          },
          "20/06": {
            "initial": "7014.03",
            "final": "7026.95"
          },
          "21/06": {
            "initial": "7026.95",
            "final": "7033.88"
          },
          "22/06": {
            "initial": "7033.88",
            "final": "7041.5"
          },
          "23/06": {
            "initial": "7041.5",
            "final": "7043.4"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "7043.4",
            "final": "7049.9"
          },
          "26/06": {
            "initial": "7049.9",
            "final": "7060.12"
          },
          "27/06": {
            "initial": "7060.12",
            "final": "7070.12"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "7070.12",
            "final": "7079.96"
          },
          "30/06": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "06/06",
      "07/06",
      "08/06",
      "09/06",
      "10/06",
      "11/06",
      "12/06",
      "13/06",
      "14/06",
      "15/06",
      "16/06",
      "17/06",
      "18/06",
      "19/06",
      "20/06",
      "21/06",
      "22/06",
      "23/06",
      "24/06",
      "25/06",
      "26/06",
      "27/06",
      "28/06",
      "29/06",
      "30/06",
      "01/07"
    ]
  },
  {
    "id": "rogerio-boa-esperança",
    "name": "Rogerio Boa esperança",
    "machines": [
      {
        "id": "M_1784136052886_89",
        "name": "JD7250",
        "ratePerHour": 800,
        "readings": {
          "18/06": {
            "initial": "1521",
            "final": "1533"
          },
          "19/06": {
            "initial": "1533",
            "final": "1546"
          },
          "20/06": {
            "initial": "1546",
            "final": "1557"
          },
          "21/06": {
            "initial": "1557",
            "final": "1567"
          },
          "22/06": {
            "initial": "1567",
            "final": "1571"
          },
          "23/06": {
            "initial": "1574",
            "final": "1575"
          }
        }
      },
      {
        "id": "M_1784136052886_74",
        "name": "LECÃO",
        "ratePerHour": 800,
        "readings": {
          "18/06": {
            "initial": "1521",
            "final": "1533"
          },
          "19/06": {
            "initial": "1533",
            "final": "1546"
          },
          "20/06": {
            "initial": "1546",
            "final": "1557"
          },
          "21/06": {
            "initial": "1557",
            "final": "1567"
          },
          "22/06": {
            "initial": "1567",
            "final": "1571"
          },
          "23/06": {
            "initial": "1574",
            "final": "1575"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "0",
            "final": "0"
          },
          "26/06": {
            "initial": "0",
            "final": "0"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052886_63",
        "name": "CLAUDINEI 1620",
        "ratePerHour": 180,
        "readings": {
          "18/06": {
            "initial": "1521",
            "final": "1533"
          },
          "19/06": {
            "initial": "1533",
            "final": "1546"
          },
          "20/06": {
            "initial": "1546",
            "final": "1557"
          },
          "21/06": {
            "initial": "1557",
            "final": "1567"
          },
          "22/06": {
            "initial": "1567",
            "final": "1570"
          },
          "23/06": {
            "initial": "1574",
            "final": "1575"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "0",
            "final": "0"
          },
          "26/06": {
            "initial": "0",
            "final": "0"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052886_96",
        "name": "CAMINHÃO",
        "ratePerHour": 180,
        "readings": {
          "18/06": {
            "initial": "1521",
            "final": "1533"
          },
          "19/06": {
            "initial": "1533",
            "final": "1546"
          },
          "20/06": {
            "initial": "1546",
            "final": "1557"
          },
          "21/06": {
            "initial": "1557",
            "final": "1567"
          },
          "22/06": {
            "initial": "1567",
            "final": "1571"
          },
          "23/06": {
            "initial": "1574",
            "final": "1575"
          },
          "24/06": {
            "initial": "0",
            "final": "0"
          },
          "25/06": {
            "initial": "0",
            "final": "0"
          },
          "26/06": {
            "initial": "0",
            "final": "0"
          },
          "27/06": {
            "initial": "0",
            "final": "0"
          },
          "28/06": {
            "initial": "0",
            "final": "0"
          },
          "29/06": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "18/06",
      "19/06",
      "20/06",
      "21/06",
      "22/06",
      "23/06",
      "24/06",
      "25/06",
      "26/06",
      "27/06",
      "28/06",
      "29/06"
    ]
  },
  {
    "id": "pedagio-lavinia",
    "name": "Pedagio lavinia",
    "machines": [
      {
        "id": "M_1784136052886_82",
        "name": "JD7250",
        "ratePerHour": 800,
        "readings": {
          "01/07": {
            "initial": "1580",
            "final": "1585"
          },
          "02/07": {
            "initial": "1585",
            "final": "1591"
          },
          "03/07": {
            "initial": "1591",
            "final": "1596"
          },
          "04/07": {
            "initial": "1596",
            "final": "1607"
          }
        }
      },
      {
        "id": "M_1784136052886_23",
        "name": "LECÃO",
        "ratePerHour": 800,
        "readings": {
          "01/07": {
            "initial": "1580",
            "final": "1585"
          },
          "02/07": {
            "initial": "1585",
            "final": "1591"
          },
          "03/07": {
            "initial": "1591",
            "final": "1596"
          },
          "04/07": {
            "initial": "1596",
            "final": "1607"
          },
          "05/07": {
            "initial": "0",
            "final": "0"
          },
          "06/07": {
            "initial": "0",
            "final": "0"
          },
          "07/07": {
            "initial": "0",
            "final": "0"
          },
          "08/07": {
            "initial": "0",
            "final": "0"
          },
          "09/07": {
            "initial": "0",
            "final": "0"
          },
          "10/07": {
            "initial": "0",
            "final": "0"
          },
          "11/07": {
            "initial": "0",
            "final": "0"
          },
          "12/07": {
            "initial": "0",
            "final": "0"
          },
          "13/07": {
            "initial": "0",
            "final": "0"
          },
          "14/07": {
            "initial": "0",
            "final": "0"
          }
        }
      },
      {
        "id": "M_1784136052886_89",
        "name": "CLAUDINEI 1620",
        "ratePerHour": 180,
        "readings": {
          "01/07": {
            "initial": "1580",
            "final": "1585"
          },
          "02/07": {
            "initial": "1585",
            "final": "1591"
          },
          "03/07": {
            "initial": "1591",
            "final": "1596"
          },
          "04/07": {
            "initial": "1596",
            "final": "1607"
          },
          "05/07": {
            "initial": "0",
            "final": "0"
          },
          "06/07": {
            "initial": "0",
            "final": "0"
          },
          "07/07": {
            "initial": "0",
            "final": "0"
          },
          "08/07": {
            "initial": "0",
            "final": "0"
          },
          "09/07": {
            "initial": "0",
            "final": "0"
          },
          "10/07": {
            "initial": "0",
            "final": "0"
          },
          "11/07": {
            "initial": "0",
            "final": "0"
          },
          "12/07": {
            "initial": "0",
            "final": "0"
          },
          "13/07": {
            "initial": "0",
            "final": "0"
          },
          "14/07": {
            "initial": "0",
            "final": "0"
          }
        }
      }
    ],
    "dates": [
      "01/07",
      "02/07",
      "03/07",
      "04/07",
      "05/07",
      "06/07",
      "07/07",
      "08/07",
      "09/07",
      "10/07",
      "11/07",
      "12/07",
      "13/07",
      "14/07"
    ]
  }
];

export const initialExpenses: Expense[] = [
  {
    "id": "E_1",
    "date": "2026-06-10",
    "type": "diesel",
    "value": 5418,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_2",
    "date": "2026-06-11",
    "type": "diesel",
    "value": 6134.4,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_3",
    "date": "2026-06-18",
    "type": "diesel",
    "value": 6202.18,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_4",
    "date": "2026-06-20",
    "type": "diesel",
    "value": 7079.6,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_5",
    "date": "2026-06-21",
    "type": "diesel",
    "value": 5912.7,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_6",
    "date": "2026-06-22",
    "type": "diesel",
    "value": 782.5,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_7",
    "date": "2026-06-13",
    "type": "alimentação",
    "value": 2760,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_8",
    "date": "2026-06-20",
    "type": "alimentação",
    "value": 1000,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_9",
    "date": "2026-06-22",
    "type": "alimentação",
    "value": 2969,
    "localityName": "STA Aracangua"
  },
  {
    "id": "E_10",
    "date": "2026-06-17",
    "type": "alimentação",
    "value": 16,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_11",
    "date": "2026-06-17",
    "type": "gasolina",
    "value": 257.8,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_12",
    "date": "2026-06-17",
    "type": "pedagio",
    "value": 33.9,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_13",
    "date": "2026-06-17",
    "type": "gasolina",
    "value": 265.87,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_14",
    "date": "2026-06-18",
    "type": "alimentação",
    "value": 65,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_15",
    "date": "2026-06-18",
    "type": "alimentação",
    "value": 223.16,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_16",
    "date": "2026-06-20",
    "type": "diesel",
    "value": 6690,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_17",
    "date": "2026-06-22",
    "type": "diesel",
    "value": 6690,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_18",
    "date": "2026-06-26",
    "type": "alimentação",
    "value": 879,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_19",
    "date": "2026-06-30",
    "type": "gasolina",
    "value": 256.45,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_20",
    "date": "2026-07-02",
    "type": "alimentação",
    "value": 502,
    "localityName": "Rogerio Boa esperança"
  },
  {
    "id": "E_21",
    "date": "2026-07-03",
    "type": "gasolina",
    "value": 290.35,
    "localityName": "Rogerio Boa esperança"
  }
];

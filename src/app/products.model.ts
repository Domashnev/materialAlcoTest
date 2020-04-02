
export interface IHeader{
    // Номер
    "number": string, // не более 5 символов
    // Дата постановки на баланс
    "actDate": Date, // формат: 'YYYY-mm-dd'
    // Тип постановки на баланс
    "typeChargeOn": string
}

export interface IPosition{
    "identity": number;
    "product" : IProducts;
    "quantity": number;
    // неограниченный массив данных типа code
    "barcodeInfo": string[]
}

export interface IChargeOn {
    header: IHeader;
    content: IPosition[];
}
export interface IDocument {
    chargeOn: IChargeOn;
}

interface IAddress{
    "country": string, // не более 3 символов
    "description": string
};

interface IProducers{
    "clientId": string,
    "fullName": string,
    "shortName": string,
    "address": IAddress
};

export interface IProducts{
    "fullName": string,
    "alcCode": string,
    "producer": IProducers,
    "productVCode": string 
}


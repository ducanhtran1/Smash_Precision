import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';
import moment from 'moment';

@Injectable()
export class VnpayService {
  public generatePaymentUrl(
    ipAddr: string,
    amount: number,
    orderInfo: string,
    returnUrl: string,
    checkoutId: string,
  ): string {
    const tmnCode = process.env.VNP_TMNCODE || '';
    const secretKey = process.env.VNP_HASHSECRET || '';
    let vnpUrl =
      process.env.VNP_URL ||
      'https://pay.vnpay.vn/vpcpay.html';

    const createDate = moment(new Date()).format('YYYYMMDDHHmmss');
    const orderId = checkoutId;

    const vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // Amount is in VND * 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort params
    const sortedParams = this.sortObject(vnp_Params);

    // Create query string
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(sortedParams, { encode: false });

    return vnpUrl;
  }

  public verifyIpn(vnp_Params: any): boolean {
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secretKey = process.env.VNP_HASHSECRET || '';

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  private sortObject(obj: any): any {
    const sorted: any = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}

import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3333",
});

export default api;

/*
192.168.1.78
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : fe80::5a98:35ff:fe7e:c356%14
                                       192.168.1.254
*/

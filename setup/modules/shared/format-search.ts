export const FORMAT_SEARCH = (key = 'title') => `(e,a) => {if(e)return e;let r=(a.${key}||"").trim().replace(/ /g,"-").toLowerCase();return[{value:"č",replace:"c"},{value:"ć",replace:"c"},{value:"ž",replace:"z"},{value:"đ",replace:"d"},{value:"š",replace:"s"}].forEach(e=>r=r.replace(new RegExp(e.value,"g"),e.replace)),r}`;

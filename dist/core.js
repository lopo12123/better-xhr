const o=(o,e,n,t)=>(o=Math.max(o,1),new Promise(((c,s)=>{const h=()=>{e(...n).then(c).catch((e=>{o<=0||t?.(e)?s(e):(o-=1,h())}))};h()})));o(3,(()=>new Promise(((o,e)=>{setTimeout((()=>{console.log("error"),e("finish")}),1e3)}))),[],(o=>!1)).then((o=>{console.log(o)})).catch((o=>{console.log(o)}));export{o as do_retry_task};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXMiOlsiLi4vbGliL2NvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOltudWxsXSwibmFtZXMiOlsiZG9fcmV0cnlfdGFzayIsIm1heCIsInRhc2siLCJhcmdzIiwiaW1tZWRpYXRlX2NvbmRpdGlvbiIsIk1hdGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJldHJ5X2Nsb3N1cmUiLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJzZXRUaW1lb3V0IiwiY29uc29sZSIsImxvZyIsInJlcyJdLCJtYXBwaW5ncyI6IkFBT00sTUFBQUEsRUFBZ0IsQ0FDbEJDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEtBQ0FILEVBQU1JLEtBQUtKLElBQUlBLEVBQUssR0FFYixJQUFJSyxTQUFrQixDQUFDQyxFQUFTQyxLQUNuQyxNQUFNQyxFQUFnQixLQUNsQlAsS0FBUUMsR0FDSE8sS0FBS0gsR0FDTEksT0FBTUMsSUFDQVgsR0FBTyxHQUFLRyxJQUFzQlEsR0FBTUosRUFBT0ksSUFFOUNYLEdBQU8sRUFDUFEsU0FJaEJBLFFBUVJULEVBQWMsR0FDVixJQUNXLElBQUlNLFNBQVEsQ0FBQ0MsRUFBU0MsS0FDekJLLFlBQVcsS0FDUEMsUUFBUUMsSUFBSSxTQUNaUCxFQUFPLFlBQ1IsU0FHWCxJQUNDSSxJQUFRLElBRVJGLE1BQUtNLElBQ0ZGLFFBQVFDLElBQUlDLE1BRWZMLE9BQU1DLElBQ0hFLFFBQVFDLElBQUlIIn0=

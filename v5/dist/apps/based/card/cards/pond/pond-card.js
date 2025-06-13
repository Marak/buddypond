function e(e,n){if(n.pondNames){const o=e.querySelector(".pond-list");n.pondNames.forEach((e=>{const n=document.createElement("a");n.href="#",n.className="card-pond-pond-name",n.textContent="#"+e,n.title=`Join the ${e} pond`,n.onclick=()=>{bp.apps.buddylist.joinPond(e)},o.appendChild(n)}))}}export{e as default};
//# sourceMappingURL=pond-card.js.map

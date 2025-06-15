class t{constructor(t,s={}){return this.bp=t,this.options=s,this.rewardInterval=null,this}async init(){return"loaded rewards"}async requestReward(){this.bp.apps.buddylist.client&&this.bp.apps.buddylist.client.wsClient.send(JSON.stringify({action:"rewards:request",buddyname:this.bp.me,qtokenid:this.bp.qtokenid}))}async open(){}}export{t as default};
//# sourceMappingURL=rewards.js.map

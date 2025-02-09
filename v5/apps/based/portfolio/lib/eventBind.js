export default function eventBind (parent) {


    $('.trade-assets', parent).on('click', () => {
        this.bp.open('orderbook');
    });

    $('.mint-coins', parent).on('click', () =>{
        this.bp.open('coin');
    });

    $('.send-coins', parent).on('click', () =>{
        this.bp.open('coin', {  type: "coin-send" });
    });

}
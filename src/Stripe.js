import Lambda from "./Lambda";

class Stripe {
    static createCharge(token) {
        Lambda.invokePaymentLambda({
            token
        });
    }
}

export default Stripe;

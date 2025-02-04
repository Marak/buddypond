import tape from "tape";
import Coin from "../lib/Coin.js";

let testUserA = 'Bob';
let testUserB = 'Sally';

let gbp = null;

// Create a new Coin instance
tape("Should create a new Coin instance", (t) => {
    let coin = new Coin();
    t.ok(coin, "Coin instance created");
    t.end();
});

// Bob mints GBP with infinite supply
tape("Bob can mint a new coin GBP that has infinite supply", (t) => {
    gbp = new Coin({
        owner: testUserA,
        name: 'Good Buddy Points',
        symbol: 'GBP',
        supply: Infinity
    });
    gbp.mint(110);
    console.log('gbp', gbp.stubBalances)
    t.ok(gbp, "GBP Coin instance created");
    t.equal(gbp.balanceOf(testUserA), 110, "Bob's balance is 110");
    t.end();
});
// Bob sends 100 GBP to Sally
tape("Bob can send 90 GBP to Sally", (t) => {
    gbp.send(90, testUserB, testUserA);
    console.log(gbp.balanceOf(testUserA));
    t.equal(gbp.balanceOf(testUserA), 20, "Bob's balance is 20");
    t.equal(gbp.balanceOf(testUserB), 90, "Sally's balance is 90");
    t.end();
});

// Sally sends 50 GBP to Bob
tape("Sally can send 50 GBP to Bob", (t) => {
    console.log('gbp', gbp.stubBalances)
    gbp.send(50, testUserA, testUserB);
    console.log('gbp', gbp.stubBalances)

    t.equal(gbp.balanceOf(testUserA), 70, "Bob's balance is 70");
    t.equal(gbp.balanceOf(testUserB), 40, "Sally's balance is 40");
    t.end();
});

// Bob burns 50 GBP
tape("Bob can burn 50 GBP", (t) => {
    gbp.burn(50, testUserA);
    t.equal(gbp.balanceOf(testUserA), 20, "Bob's balance is 20");
    t.end();
});


// Sally cannot burn 41 GBP (not enough balance)
tape("Sally cannot burn 41 GBP", (t) => {
    t.throws(() => gbp.burn(41, testUserB), /Not enough balance to burn./, "Sally cannot burn 41 GBP");
    t.equal(gbp.balanceOf(testUserB), 40, "Sally's balance remains 40");
    t.end();
});

// Sally burns 40 GBP
tape("Sally can burn 40 GBP", (t) => {
    gbp.burn(40, testUserB);
    t.equal(gbp.balanceOf(testUserB), 0, "Sally's balance is 0");
    t.end();
});

// Bob sets the supply of GBP to 1000
tape("Bob can set supply of GBP to 1000", (t) => {
    gbp.setSupply(1000, 'Bob');
    t.equal(gbp.getSupply(), 1000, "GBP supply is set to 1000");
    t.end();
});

// Bob can mint another 500 GBP
tape("Bob can mint another 500 GBP", (t) => {
    gbp.mint(500);
    t.equal(gbp.balanceOf(testUserA), 520, "Bob's balance is 520");
    t.end();
});

/*
// Bob cannot mint another 510 GBP (exceeds supply)
tape("Bob cannot mint another 510 GBP", (t) => {
    t.throws(() => gbp.mint(510), /Cannot mint more than the supply/, "Bob cannot mint another 510 GBP");
    t.end();
});
*/


/*


// Bob cannot send 2000 GBP to Sally
tape("Bob cannot send 2000 GBP to Sally", (t) => {
    t.throws(() => gbp.send(2000, testUserB, testUserA), /Insufficient balance/, "Bob cannot send 2000 GBP");
    t.end();
});

// Bob cannot burn 2000 GBP
tape("Bob cannot burn 2000 GBP", (t) => {
    t.throws(() => gbp.burn(2000, testUserA), /Insufficient balance/, "Bob cannot burn 2000 GBP");
    t.end();
});

// Bob sends 100 GBP to Sally
tape("Bob can send 100 GBP to Sally", (t) => {
    gbp.mint(100);
    gbp.send(100, testUserB, testUserA);
    t.equal(gbp.balanceOf(testUserA), 0, "Bob's balance is 0");
    t.equal(gbp.balanceOf(testUserB), 100, "Sally's balance is 100");
    t.end();
});

// Sally burns 100 GBP
tape("Sally can burn 100 GBP", (t) => {
    gbp.burn(100, testUserB);
    t.equal(gbp.balanceOf(testUserB), 0, "Sally's balance is 0");
    t.end();
});

// Bob burns 100 GBP
tape("Bob can burn 100 GBP", (t) => {
    gbp.mint(100);
    gbp.burn(100, testUserA);
    t.equal(gbp.balanceOf(testUserA), 0, "Bob's balance is 0");
    t.end();
});

// Bob mints 2000 GBP
tape("Bob can mint 2000 GBP", (t) => {
    gbp.mint(2000);
    t.equal(gbp.balanceOf(testUserA), 2000, "Bob's balance is 2000");
    t.end();
});

*/


// Bob mints a new coin BuddyBux with 1000 supply
tape("Bob can mint a new coin BuddyBux with 1000 supply", (t) => {
    let buddyBux = new Coin({
        owner: testUserA,
        name: 'BuddyBux',
        symbol: 'BBX',
        supply: 1000
    });
    buddyBux.mint(500);
    t.ok(buddyBux, "BuddyBux instance created");
    t.equal(buddyBux.balanceOf(testUserA), 500, "Bob's balance in BBX is 500");
    t.end();
});
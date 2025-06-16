import tape from 'tape';
import BuddyScript from '../buddyscript.js'; // Ensure the path matches where the BuddyScript class is defined

// TODO: how can this test pass unless we use addCommand to define give and points?
tape('Test isValidBuddyScript method', (t) => {
    const bs = new BuddyScript();
    t.ok(bs.isValidBuddyScript('give'), 'Command "give" should be valid');
    t.ok(bs.isValidBuddyScript('points'), 'Command "points" should be valid');
    t.notOk(bs.isValidBuddyScript('invalid'), 'Command "invalid" should not be valid');
    t.end();
});

/* add test for addCommand for points and give commands
*/

tape('Test addCommand method', (t) => {
    const bs = new BuddyScript();
    bs.addCommand('give', (context) => {
        console.log('Giving:', context);
        return false;
    });
    bs.addCommand('points', (context) => {
        console.log('Points:', context);
        return true;
    });

    t.ok(bs.isValidBuddyScript('give'), 'Command "give" should be valid after addition');
    t.ok(bs.isValidBuddyScript('points'), 'Command "points" should be valid after addition');
    t.end();
});

/*
tape('Test parseCommand for valid backslash commands', (t) => {
    const bs = new BuddyScript();
    let result = bs.parseCommand('\\give');
    t.equal(result.command, 'give', 'Parsed command should be "give"');
    t.equal(result.type, 'execute', 'Type should be "execute"');

    result = bs.parseCommand('\\points');
    t.equal(result.command, 'points', 'Parsed command should be "points"');
    t.end();
});
*/

tape('Test parseCommand for invalid backslash commands', (t) => {
    const bs = new BuddyScript();
    let result = bs.parseCommand('\\invalid');
    t.equal(result.type, 'invalid', 'Invalid command should return type "invalid"');
    t.end();
});

tape('Test command execution', (t) => {
    const bs = new BuddyScript();
    const context = { message: {}, windowId: 'testWindow' };
    /*
    let result = bs.executeCommand('give', context);
    t.equal(result, false, 'Executing "give" should return false');

    result = bs.executeCommand('points', context);
    t.equal(result, true, 'Executing "points" should return true');
    */

    t.end();
});

tape('Test handlePipes for valid piping', (t) => {
    const bs = new BuddyScript();
    let result = bs.handlePipes('/give | /points');
    t.deepEqual(result, [false, true], 'Piping give and points should return [false, true]');
    t.end();
});

tape('Test handlePipes for invalid commands in pipes', (t) => {
    const bs = new BuddyScript();
    let result = bs.handlePipes('/give | /invalid');
    t.equal(result.type, 'invalid', 'Piping with invalid command should return "invalid" type');
    t.end();
});

tape('Test adding and removing custom commands', (t) => {
    const bs = new BuddyScript();
    bs.addCommand('hello', (context) => {
        console.log('Hello,', context);
        return 'hello';
    });

    t.ok(bs.isValidBuddyScript('hello'), 'Custom command "hello" should be valid after addition');

    let result = bs.executeCommand('hello', { name: 'world' });
    t.equal(result, 'hello', 'Executing "hello" should return "hello"');

    bs.removeCommand('hello');
    t.notOk(bs.isValidBuddyScript('hello'), 'Custom command "hello" should not be valid after removal');
    t.end();
});

tape('Test running custom command from text', (t) => {
    const bs = new BuddyScript();
    bs.addCommand('hello', () => {
        return `hello`
    });

    let result = bs.parseCommand('/hello');
    console.log('rrrresult', result);
    t.equal(result[0], 'hello', 'Running "/hello" should return "hello"');

    bs.removeCommand('hello');

    t.end();
});


tape('Test running custom command from text with args', (t) => {
    const bs = new BuddyScript();
    bs.addCommand('echo', (context) => {
        return `Echo: ${context}`;
    });

    let result = bs.parseCommand('/echo Hello');
    console.log('rrrresult', result);
    t.equal(result[0], 'Echo: Hello', 'Running "/echo Hello" should return "Echo: Hello"');

    bs.removeCommand('echo');

    t.end();
});

function add(a: number, b: number) {
    return a + b;
}

export default function LegacyFunctions() {
    const twoPlusFour = add(2, 4);
    console.log(twoPlusFour);
    return (
        <div id="wd-legacy-functions">
        <h3>Functions</h3>
        <h4>Legacy ES5 functions</h4>
        twoPlusFour = {twoPlusFour}    <br />
        add(2, 4) = {add(2, 4)}        <hr />
        </div>
    );
}

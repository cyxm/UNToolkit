import Splitter, { SplitDirection } from "@devbookhq/splitter"
export default function Home() {
    return (
        <Splitter direction={SplitDirection.Horizontal} minWidths={200}>
            <div>234</div>
            <div>4123</div>
        </Splitter>
    );
}
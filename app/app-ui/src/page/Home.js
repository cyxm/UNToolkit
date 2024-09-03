import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Button from '@mui/material/Button';

export default function Home() {
    return (
        <Splitter direction={SplitDirection.Horizontal} minWidths={200}>
            <div>234</div>
            <Button variant="contained">Hello world</Button>
        </Splitter>
    );
}
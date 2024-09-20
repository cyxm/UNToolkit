export async function handleClick(setState) {
    const filePath = await window.eApi.openFile();
    setState(filePath);
}
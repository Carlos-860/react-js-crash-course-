export default function NotFound({message}) {
    if (message) {
        return <p>{message}</p>
    }

    return <p>The page you are looking for was not found</p>
}
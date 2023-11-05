
import { useEffect } from "react"

const useTitle = (title) => {
    useEffect(() => {
        document.title = `Smart Voting- ${title}`
    }, [title])
}

export default useTitle;

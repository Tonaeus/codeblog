import Tiptap from "@/components/Tiptap"
import { Input } from "@/components/ui/input"

const page = () => {
  return (
    <div className="min-w-screen flex flex-col justify-center items-center">
      <Input placeholder="" className="w-25 mb-5" />
      <Tiptap />
    </div>
  )
}

export default page
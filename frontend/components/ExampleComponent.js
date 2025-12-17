import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ExampleComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/hello')
      .then(res => setData(res.data.message))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="mt-5">
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click Me
      </button>
      {data && <p className="mt-2 text-gray-700">{data}</p>}
    </div>
  )
}

import React from "react"
import AddNewBlog from "./AddNewBlog"
import ManageBlogs from "./ManageBlogs"

const Blog = () => {
  return (
    <div className='px-10 pt-10'>
      <ManageBlogs />
      <div className="flex justify-end mt-6">
        <AddNewBlog />
      </div>
    </div>
  )
}

export default Blog
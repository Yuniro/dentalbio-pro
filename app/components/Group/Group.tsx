'use client'

import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import LabeledInput from "@/app/dashboard/components/LabeledInput";
import { CaretDown, CaretUp, PencilSimple, Spinner, Trash } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useReducer, useState } from "react";

type BlogGroupProps = BlogGroupType & {
  onUpdate: ({ id, name, enabled }: { id: string, name?: string, enabled?: boolean }) => void;
  onDelete: ({ id }: { id: string }) => void;
}

const BlogGroup: React.FC<BlogGroupProps> = ({
  onUpdate,
  onDelete,
  ...group
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isActive, toggleIsActive] = useReducer((prevState) => !prevState, group.enabled!);
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>(group.name || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (group.enabled !== isActive) {
      onUpdate({ id: group.id, enabled: isActive });
    }
  }, [isActive])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await onUpdate({ id: group.id, name: heading });

    setIsLoading(false);
    setIsEditing(false);
  }

  const handleDelete = () => {
    onDelete({ id: group.id });
  }

  return (
    <div>
      {isEditing ?
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full mb-4"
          >
            <LabeledInput
              label="Group Title"
              name="name"
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
            <div className="flex gap-2 pt-2 w-full justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#5046db] hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
              >
                {isLoading && <Spinner className="animate-spin" size={20} />} Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-neutral-500 hover:bg-opacity-80 transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div> :
        <div className="w-full bg-[#c8dff6] p-6 rounded-[26px] flex items-center overflow-hidden gap-4 mb-4">
          {/* Caret Buttons */}
          <div className="cursor-pointer">
            <div><CaretUp /></div>
            <div><CaretDown /></div>
          </div>

          {/* Title and Content */}
          <div className="flex-grow text-[14px] overflow-hidden">
            {/* Title Row */}
            <div className="flex flex-1 items-center justify-center truncate gap-2">
              <div className="text-[#5046db] font-bold truncate">{group.name}</div>
              <PencilSimple
                size={18}
                className="cursor-pointer flex-shrink-0 hover:text-[#5046db]"
                onClick={() => setIsEditing(true)}
              />
            </div>

            {/* Content Row */}
            {/* <div className="truncate" dangerouslySetInnerHTML={{__html: content!}} /> */}
          </div>

          {/* Trash Button */}
          <div className="flex items-center gap-2">
            <div onClick={() => setIsOpenConfirmMessage(true)}>
              <Trash size={20} className="cursor-pointer hover:text-red-700" />
            </div>

            <div className="form-check form-switch custom-form-check">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                role="switch"
                // id={`flexSwitchCheckChecked-${link.link_id}`}
                checked={isActive}
                onChange={toggleIsActive}
              />
            </div>
          </div>
        </div>}


      <ConfirmMessage
        description="Aure you sure you want to delete the group?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </div>
  )
}

export default BlogGroup;
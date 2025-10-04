import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  console.log("the modalData in subSectionModal",modalData)
  
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [selectedVideoFile, setSelectedVideoFile] = useState(null) // Store actual file
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [view, edit, modalData, setValue])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    console.log("🚀 SubSection Form Data:", data);
    console.log("📹 Selected video file:", selectedVideoFile);
    
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    // Validation
    if (!data.lectureTitle?.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    if (!data.lectureDesc?.trim()) {
      toast.error("Please enter lecture description");
      return;
    }

    if (!selectedVideoFile) {
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    
    // Use selectedVideoFile instead of data.lectureVideo
    if (selectedVideoFile && selectedVideoFile instanceof File) {
      console.log("✅ Adding selected video file to FormData");
      console.log("📹 File details:", {
        name: selectedVideoFile.name,
        size: selectedVideoFile.size,
        type: selectedVideoFile.type
      });
      formData.append("video", selectedVideoFile);
    } else {
      console.log("❌ No valid video file selected");
      console.log("📹 selectedVideoFile:", selectedVideoFile);
      toast.error("Please select a video file");
      setLoading(false);
      return;
    }
    
    setLoading(true)
    
    console.log("📋 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
    
    const result = await createSubSection(formData, token);
    // console.log(result , " is result");
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Lecture Video {!view && <sup className="text-pink-200">*</sup>}
            </label>
            
            <div className="flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 bg-richblack-700">
              {selectedVideoFile ? (
                <div className="flex w-full flex-col p-6">
                  <video 
                    className="h-full w-full rounded-md object-cover" 
                    controls
                    src={URL.createObjectURL(selectedVideoFile)}
                  />
                  <p className="mt-2 text-richblack-200">{selectedVideoFile.name}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedVideoFile(null)}
                    className="mt-3 text-richblack-400 underline"
                  >
                    Remove Video
                  </button>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center p-6">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log("📹 File selected:", file);
                      console.log("📹 File details:", {
                        name: file?.name,
                        size: file?.size,
                        type: file?.type,
                        isFile: file instanceof File
                      });
                      if (file) {
                        setSelectedVideoFile(file);
                        setValue("lectureVideo", file); // Also set in form
                      }
                    }}
                    className="hidden"
                    id="videoInput"
                  />
                  <label 
                    htmlFor="videoInput" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                      <span className="text-2xl text-yellow-50">📹</span>
                    </div>
                    <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                      Click to select a video file
                    </p>
                    <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                      <li>Format: MP4</li>
                      <li>Max size: 100MB</li>
                    </ul>
                  </label>
                </div>
              )}
            </div>
            
            {errors.lectureVideo && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Video is required
              </span>
            )}
          </div>
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
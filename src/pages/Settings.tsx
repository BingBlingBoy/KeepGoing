import { Navigate, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext"
import { Dropdown } from "../components/ui/Dropdown";
import { useEffect, useRef, useState } from "react";
import profile_pic from "../assets/profile_pic.png"
import { Input } from "../components/ui/Input";
import { Check, X } from "lucide-react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

const displayOptions = [
  {
    label: "Light",
    value: "Light"
  },
  {
    label: "Dark",
    value: "Dark"
  }
];

export default function Settings() {
  const { user, loading, signOut, updateNewUsername, deleteUser } = useAuth();
  const [display, setDisplay] = useState("");

  const [changeUser, setChangeUser] = useState(false)
  const [newUsername, setNewUsername] = useState(user?.name || "")

  const [changePass, setChangePass] = useState(false)
  const [passForm, setPassForm] = useState({
    password: "",
    confirmPassword: ""
  })

  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const navigate = useNavigate();

  const formRef = useRef(null);
  useOnClickOutside(formRef, () => setChangeUser(false))

  const passRef = useRef(null);
  useOnClickOutside(passRef, () => setChangePass(false))

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  async function handleUserDelete(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      await deleteUser()
      await signOut()
      navigate("/auth/sign-in")
    } catch (err) {
      console.log(`${err}`)
    }
  }

  async function handleNewUsername(e: React.SubmitEvent) {
    e.preventDefault()

    const body = {
      userId: user.id,
      newUsername: newUsername
    }
    try {
      await updateNewUsername(body)
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }
  useEffect(() => {
    if (user?.name) {
      setNewUsername(user.name)
    }
  }, [user?.name])

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }


  return (
    <div className="flex grow min-h-screen mt-10">
      <div className="max-w-112.5 w-full mx-auto">
        <div className="flex flex-col space-y-16">
          <section>
            <h2 className="text-3xl">Appearance</h2>
            <div className="relative">
              <div className="mt-10 flex flex-col space-y-4">
                <label>Light/Dark mode:</label>
                <Dropdown options={displayOptions} placeholder="Create Habit" containerPos="" />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-3xl">Profile Details</h2>
            <div className="mt-10 flex flex-col space-y-4">
              <img
                className="w-30 h-30 p-1 rounded-full ring-2 ring-accent-taupe cursor-pointer"
                src={profile_pic}
                alt="Rounded Avatar"
              />
              <form onSubmit={handleNewUsername}>
                <Input
                  id="title"
                  caption="Username"
                  value={newUsername}
                  onChange={(e) => { setNewUsername(e.target.value) }}
                  onClick={() => { setChangeUser(true) }}
                  captionClassName="text-accent-ash"
                  className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
                />
                {changeUser && (
                  <div className="flex items-center justify-end gap-x-4 mt-4" ref={formRef}>
                    <Button
                      onClick={() => { setNewUsername(user.name) }}
                      variant="primary"
                      size="md"
                      className="rounded-md"
                    >
                      <div className="flex items-center gap-x-1">
                        <X className="w-5 h-5" />
                        Undo
                      </div>
                    </Button>
                    <Button type="submit" variant="primary" size="md" className="rounded-md">
                      <div className="flex items-center gap-x-1">
                        <Check className="w-5 h-5" />
                        Save Changes
                      </div>
                    </Button>
                  </div>
                )}
              </form>
              <Button className="max-w-25" variant="primary" size="md" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </section>
          <section>
            <h2 className="text-3xl">Account security</h2>
            <form className="mt-10 flex flex-col gap-y-2" ref={passRef} >

              <Input
                id="title"
                caption="Login email:"
                value={user.email}
                captionClassName="text-accent-ash"
                className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
                disabled
              />
              <Input
                id="title"
                caption="New Password:"
                captionClassName="text-accent-ash"
                className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
              />
              <Input
                id="title"
                caption="Confirm New Password:"
                captionClassName="text-accent-ash"
                className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
              />
              <div className="flex items-center justify-end mt-4">
                <Button type="submit" variant="primary" size="md" className="rounded-md">
                  <div className="flex items-center gap-x-1">
                    <Check className="w-5 h-5" />
                    Save Changes
                  </div>
                </Button>
              </div>
            </form>
          </section>
          <section>
            <div className="text-red-300 space-y-2">
              <h2 className="text-3xl">Danger Zone</h2>
              <p>
                Deleting your account will sign you out and delete all your data <span className="font-semibold">permanently</span>.
                You will need to recreate a new account and start from scratch if you do decide to come back.
              </p>
              <form onSubmit={handleUserDelete}>
                <Input
                  id="title"
                  caption="Enter your username:"
                  placeholder={user.name}
                  captionClassName="text-accent-ash"
                  className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
                  onChange={(e) => { setDeleteConfirmation(e.target.value) }}
                />
                <div className="flex items-center justify-center mt-4">
                  <Button type="submit" variant="primary" size="md" className="rounded-md" disabled={deleteConfirmation !== user.name}>
                    <div className="flex items-center gap-x-1">
                      Delete my account
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

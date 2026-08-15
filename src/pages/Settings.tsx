import { Navigate, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext'
import { Dropdown } from '../components/ui/Dropdown';
import React, { useEffect, useRef, useState } from 'react';
import profile_pic from '../assets/profile_pic.png'
import { Input } from '../components/ui/Input';
import { Check, X } from 'lucide-react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { authClient } from '../lib/auth';
import type { ProfileData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Modal } from '../components/ui/Modal';

const displayOptions = [
  {
    label: 'Light',
    value: 'Light'
  },
  {
    label: 'Dark',
    value: 'Dark'
  }
];

export default function Settings() {
  const {
    user,
    loading,
    signOut,
    updateNewUsername,
    deleteUser,
    getProfileData,
    updateDisplayPref
  } = useAuth();

  const [display, setDisplay] = useState<string>('Light');
  const [profile, setProfile] = useState<ProfileData>()

  const [changeUser, setChangeUser] = useState(false)
  const [newUsername, setNewUsername] = useState(user?.name || '')

  const [changePass, setChangePass] = useState(false)
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [subConfirmation, setSubConfirmation] = useState<boolean>(false)

  const {
    theme,
    setTheme
  } = useTheme();

  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const navigate = useNavigate();

  const formRef = useRef(null);
  useOnClickOutside(formRef, () => setChangeUser(false))

  const passRef = useRef(null);
  useOnClickOutside(passRef, () => setChangePass(false))

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  async function handleUserDelete(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      await deleteUser()
      await signOut()
      setSubConfirmation(true)
      setOpenModal(true)

      setTimeout(() => navigate('/auth/sign-in'))
    } catch (err) {
      console.log(`${err}`)
      setErrorMessage(err.message || "Unexpected error message")
      setOpenModal(true)
    }
  }

  function updatePassForm(field: string, value: string) {
    setPassForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handlePassForm(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      const { data, error } = await authClient.changePassword({
        newPassword: passForm.newPassword,
        currentPassword: passForm.currentPassword,
      })

      if (error) throw error;

      setSubConfirmation(true)
      setOpenModal(true)
      navigate('/auth/sign-in')
    } catch (err) {
      console.error(`${err}`)
      setErrorMessage(err.message || "Unexpected error message")
      setOpenModal(true)
    }
  }

  async function handleNewUsername(e: React.SubmitEvent) {
    e.preventDefault()

    const body = {
      newUsername: newUsername
    }
    try {
      await updateNewUsername(body)
      setSubConfirmation(true)
      setOpenModal(true)
    } catch (err) {
      console.error(`${err}`)
      setErrorMessage(err.message || "Unexpected error message")
      setOpenModal(true)
    }
  }

  async function handleDisplayPref(newDisplay: string) {
    const submitValue = true ? newDisplay === 'Light' : false;

    const body = {
      newDisplayPref: submitValue
    }

    console.log("body:", body)

    try {
      await updateDisplayPref(body)
      setTheme(newDisplay === 'Dark' ? 'dark' : 'light')
    } catch (err) {
      console.log(`${err}`)
    }
  }

  const loadProfileData = async () => {
    try {
      const res = await getProfileData(user.id);
      setProfile(res[0])

      if (res[0].light_mode === true) {
        setDisplay('Light')
      } else {
        setDisplay('Dark')
      }
    } catch (err) {
      console.error(`Error has occured when getting profile data: ${err}`)
    }
  }

  useEffect(() => {
    if (user?.name) {
      setNewUsername(user.name)
      loadProfileData()
    }
  }, [user?.name])

  useEffect(() => {
    console.log("Theme: ", theme)
  }, [theme])

  if (loading) {
  }

  if (!user) {
    return <Navigate to='/auth/sign-in' replace />
  }


  return (
    <div className='flex grow min-h-screen mt-10'>
      <div className='max-w-112.5 w-full mx-auto'>
        <div className='flex flex-col space-y-16'>
          <section>
            <h2 className='text-3xl'>Appearance</h2>
            <div className='relative'>
              <div className='mt-10 flex flex-col space-y-4'>
                <label>Light/Dark mode:</label>
                <Dropdown
                  options={displayOptions}
                  placeholder='Create Habit'
                  containerPos=''
                  value={display}
                  onChange={(e) => {
                    setDisplay(e)
                    console.log('Display: ', e)
                    handleDisplayPref(e)
                  }}
                />
              </div>
            </div>
          </section>
          <section>
            <h2 className='text-3xl'>Profile Details</h2>
            <div className='mt-10 flex flex-col space-y-4'>
              <img
                className='w-30 h-30 p-1 rounded-full ring-2 ring-accent-taupe cursor-pointer'
                src={profile_pic}
                alt='Rounded Avatar'
              />
              <form onSubmit={handleNewUsername}>
                <Input
                  id='title'
                  caption='Username'
                  value={newUsername}
                  onChange={(e) => { setNewUsername(e.target.value) }}
                  onFocus={() => { setChangeUser(true) }}
                  captionClassName='text-accent-ash'
                  className='p-1 w-full border border-accent-taupe text-md font-light text-accent-ash'
                />
                {changeUser && (
                  <div className='flex items-center justify-end gap-x-4 mt-4' ref={formRef}>
                    <Button
                      onClick={() => { setNewUsername(user.name) }}
                      variant='primary'
                      size='md'
                      className='rounded-md'
                    >
                      <div className='flex items-center gap-x-1'>
                        <X className='w-5 h-5' />
                        Undo
                      </div>
                    </Button>
                    <Button type='submit' variant='primary' size='md' className='rounded-md'>
                      <div className='flex items-center gap-x-1'>
                        <Check className='w-5 h-5' />
                        Save Changes
                      </div>
                    </Button>
                  </div>
                )}
              </form>
              <Button className='max-w-25 bg-red-300 rounded-sm' variant='primary' size='md' onClick={handleSignOut}>Sign Out</Button>
            </div>
          </section>
          <section>
            <h2 className='text-3xl'>Account security</h2>
            <form onSubmit={handlePassForm} className='mt-8 flex flex-col gap-y-2' ref={passRef}>

              <Input
                id='currentPassword'
                caption='Current Password:'
                captionClassName='text-accent-ash'
                className='p-1 w-full border border-accent-taupe text-md font-light text-accent-ash'
                type='password'
                onChange={(e) => { updatePassForm("currentPassword", e.target.value) }}
                onFocus={() => { setChangePass(true) }}
                required
              />
              <Input
                id='password'
                caption='New Password:'
                captionClassName='text-accent-ash'
                className='p-1 w-full border border-accent-taupe text-md font-light text-accent-ash'
                type='password'
                onChange={(e) => { updatePassForm("newPassword", e.target.value) }}
                onFocus={() => { setChangePass(true) }}
                required
              />
              <Input
                id='confirmPassword'
                caption='Confirm New Password:'
                captionClassName='text-accent-ash'
                className='p-1 w-full border border-accent-taupe text-md font-light text-accent-ash'
                type='password'
                onChange={(e) => { updatePassForm("confirmNewPassword", e.target.value) }}
                onFocus={() => { setChangePass(true) }}
                required
              />
              {changePass && (
                <div className='flex items-center justify-end mt-4'>
                  <Button type='submit' variant='primary' size='md' className='rounded-md'>
                    <div className='flex items-center gap-x-1'>
                      <Check className='w-5 h-5' />
                      Save Changes
                    </div>
                  </Button>
                </div>
              )}
            </form>
          </section>
          <section>
            <div className='text-red-300 space-y-2'>
              <h2 className='text-3xl'>Danger Zone</h2>
              <p>
                Deleting your account will sign you out and delete all your data <span className='font-semibold'>permanently</span>.
                You will need to recreate a new account and start from scratch if you do decide to come back.
              </p>
              <form onSubmit={handleUserDelete}>
                <Input
                  id='title'
                  caption='Enter your username:'
                  placeholder={user.name}
                  captionClassName='text-accent-ash'
                  className='p-1 w-full border border-accent-taupe text-md font-light text-accent-ash'
                  onChange={(e) => { setDeleteConfirmation(e.target.value) }}
                />
                <div className='flex items-center justify-center mt-4'>
                  <Button type='submit' variant='primary' size='md' className='rounded-sm bg-red-300' disabled={deleteConfirmation !== user.name}>
                    <div className='flex items-center gap-x-1'>
                      Delete my account
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </section>
          <Modal open={openModal} onClose={() => {
            setOpenModal(false)
            setSubConfirmation(false)
            return
          }}>
            {
              errorMessage && !subConfirmation && (
                <div className="flex flex-col gap-y-2 w-full items-center justify-center">
                  <X className="w-10 h-10 bg-red-300 text-red-100 text-xl rounded-full" />
                  <p>Error: {errorMessage}</p>
                </div>
              )
            }
            {
              subConfirmation && (
                <div className="flex flex-col gap-y-2 w-full items-center justify-center">
                  <Check className="w-10 h-10 bg-green-300 text-green-100 rounded-full" />
                  <div className="flex flex-col gap-y-1 w-full items-center">
                    <h1 className="text-xl font-semibold">Success</h1>
                  </div>
                </div>
              )
            }
          </Modal>
        </div>
      </div>
    </div>
  )
}

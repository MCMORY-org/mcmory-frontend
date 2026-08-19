import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMe } from '@/api/auth.jsx'
import { isUnauthorized } from '@/api/client.jsx'
import {
  deleteFriend,
  getFriendInitial,
  listFriends,
} from '@/api/friends.jsx'
import BottomTab from '@/components/layout/BottomTab'
import AddButton from '@/components/ui/AddButton'
import EditButton from '@/components/ui/EditButton'

const FRIEND_SLOT_COUNT = 4
const DELETE_BUTTON_WIDTH = 72
const DELETE_GAP = 8
const REVEAL_WIDTH = DELETE_BUTTON_WIDTH + DELETE_GAP

function buildPeople(memberName, friends) {
  const visibleFriends = friends.slice(0, FRIEND_SLOT_COUNT)
  const me = {
    key: 'me',
    filled: true,
    isMe: true,
    initial: '나',
    name: `나 (${memberName})`,
    subtitle: '내 취향',
  }

  const filled = visibleFriends.map((friend) => ({
    key: `friend-${friend.id}`,
    filled: true,
    isMe: false,
    initial: getFriendInitial(friend.name),
    name: friend.name,
    subtitle: friend.tasteSummary ?? '',
    friend,
  }))

  const empty = Array.from(
    { length: FRIEND_SLOT_COUNT - filled.length },
    (_, index) => {
      const slotNumber = filled.length + index + 2
      return {
        key: `empty-${slotNumber}`,
        filled: false,
        isMe: false,
        initial: '친',
        name: `친구 ${slotNumber}`,
        subtitle: '',
      }
    },
  )

  return [me, ...filled, ...empty]
}

function MyPage() {
  const navigate = useNavigate()
  const [memberName, setMemberName] = useState('나')
  const [memberPhone, setMemberPhone] = useState('')
  const [friends, setFriends] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [revealedKey, setRevealedKey] = useState(null)
  const [friendToDelete, setFriendToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadPeople = useCallback(async () => {
    const [meResult, friendsResult] = await Promise.all([getMe(), listFriends()])
    const member = meResult?.member

    if (!member) {
      navigate('/login', { replace: true })
      return false
    }

    setMemberName(member.name ?? '나')
    setMemberPhone(member.phone ?? '')
    setFriends(friendsResult?.list ?? [])
    return true
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setErrorMessage('')
      try {
        await loadPeople()
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '사람들의 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [loadPeople, navigate])

  const people = buildPeople(memberName, friends)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleConfirmDelete = async () => {
    if (!friendToDelete || isDeleting) return

    const deletedId = friendToDelete.id
    setIsDeleting(true)
    setErrorMessage('')
    try {
      await deleteFriend(deletedId)
      setFriends((current) =>
        current.filter((friend) => String(friend.id) !== String(deletedId)),
      )
      setFriendToDelete(null)
      setRevealedKey(null)
      await loadPeople()
    } catch (error) {
      if (isUnauthorized(error)) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(error.message ?? '친구를 삭제하지 못했습니다.')
      setFriendToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-6">
            <p className="text-[13px] font-semibold text-primary-active">
              나와 소중한 사람들의 취향을 저장해 두세요
            </p>

            <h1 className="mt-[35px] text-h1 text-primary-dark-active">PEOPLE</h1>

            {errorMessage ? (
              <p role="alert" className="mt-4 text-[12px] font-medium text-[#9E2A2B]">
                {errorMessage}
              </p>
            ) : null}

            {isLoading ? (
              <p className="mt-[75px] text-center text-[13px] font-medium text-[#947C50]">
                불러오는 중...
              </p>
            ) : (
              <ul className="mt-[75px] flex flex-col gap-[30px]">
                {people.map((person) => (
                  <PersonRow
                    key={person.key}
                    person={person}
                    revealed={revealedKey === person.key}
                    onReveal={() => setRevealedKey(person.key)}
                    onClose={() =>
                      setRevealedKey((current) =>
                        current === person.key ? null : current,
                      )
                    }
                    onEdit={
                      person.isMe
                        ? () =>
                            navigate('/my/edit', {
                              state: {
                                isMe: true,
                                member: {
                                  name: memberName,
                                  phone: memberPhone,
                                },
                              },
                            })
                        : person.friend
                          ? () =>
                              navigate('/my/edit', {
                                state: { friend: person.friend },
                              })
                          : undefined
                    }
                    onDelete={
                      person.friend
                        ? () => setFriendToDelete(person.friend)
                        : undefined
                    }
                    onAdd={() =>
                      navigate('/my/add', { state: { slotName: person.name } })
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background"
          >
            SAVE PEOPLE
          </button>
        </div>
      </form>

      {friendToDelete ? (
        <DeleteConfirmDialog
          friendName={friendToDelete.name}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) setFriendToDelete(null)
          }}
        />
      ) : null}

      <BottomTab activeTab="my" />
    </main>
  )
}

function PersonRow({
  person,
  revealed,
  onReveal,
  onClose,
  onEdit,
  onDelete,
  onAdd,
}) {
  const canSwipe = Boolean(person.friend)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const offsetRef = useRef(0)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startOffset: 0,
    axis: null,
    moved: false,
  })

  const updateOffset = (value) => {
    const next = Math.max(0, Math.min(REVEAL_WIDTH, value))
    offsetRef.current = next
    setOffset(next)
  }

  useEffect(() => {
    if (dragRef.current.active) return
    updateOffset(revealed ? REVEAL_WIDTH : 0)
  }, [revealed])

  const handlePointerDown = (event) => {
    if (!canSwipe) return
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      axis: null,
      moved: false,
    }
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag.active) return

    const dx = drag.startX - event.clientX
    const dy = event.clientY - drag.startY

    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (drag.axis === 'y') {
        drag.active = false
        setDragging(false)
        return
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }

    if (drag.axis !== 'x') return
    drag.moved = true
    updateOffset(drag.startOffset + dx)
  }

  const finishDrag = () => {
    const drag = dragRef.current
    if (!drag.active && !dragging) return
    drag.active = false
    setDragging(false)

    if (drag.axis !== 'x') return

    const shouldOpen = offsetRef.current > REVEAL_WIDTH / 2
    updateOffset(shouldOpen ? REVEAL_WIDTH : 0)
    if (shouldOpen) onReveal()
    else onClose()
  }

  const handleEditClick = () => {
    if (dragRef.current.moved) return
    onEdit?.()
  }

  return (
    <li className="overflow-hidden">
      <div
        className={`flex w-full select-none ${
          canSwipe ? 'touch-none' : 'touch-pan-y'
        } ${dragging ? '' : 'transition-transform duration-200'}`}
        style={{ transform: `translateX(-${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="flex w-full shrink-0 items-center justify-between bg-background">
          <div
            className={`flex items-center gap-[15px] ${
              person.filled ? '' : 'opacity-30'
            }`}
          >
            <span
              className={`flex size-[47px] shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-[#3E281B] ${
                person.isMe
                  ? 'bg-[#C5A56A]'
                  : 'border-[0.5px] border-[#C5A56A] bg-[#FAF9F6]'
              }`}
            >
              {person.initial}
            </span>
            <div className="flex flex-col items-start gap-[5px]">
              <p className="text-[18px] font-semibold text-[#3E281B]">{person.name}</p>
              {person.subtitle ? (
                <p className="text-[12px] font-normal text-[#947C50]">{person.subtitle}</p>
              ) : null}
            </div>
          </div>

          {person.filled ? (
            <EditButton onClick={handleEditClick} />
          ) : (
            <AddButton onClick={onAdd} />
          )}
        </div>

        {canSwipe ? (
          <button
            type="button"
            aria-label={`${person.name} 삭제`}
            onClick={(event) => {
              event.stopPropagation()
              onDelete?.()
            }}
            className="ml-2 flex h-[35px] w-[72px] shrink-0 items-center justify-center self-center rounded-[10px] bg-[#9E2A2B] text-[16px] font-semibold text-[#F9F6F0]"
          >
            DELETE
          </button>
        ) : null}
      </div>
    </li>
  )
}

function DeleteConfirmDialog({ friendName, isDeleting, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-[rgba(69,58,37,0.25)]"
      onClick={onCancel}
    >
      <div className="flex h-full w-full max-w-[412px] items-center justify-center px-[30px]">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="friend-delete-title"
          onClick={(event) => event.stopPropagation()}
          className="flex h-[113px] w-[352px] flex-col items-center overflow-hidden rounded-[10px] bg-[#FAF9F6] pt-[21px] shadow-[2px_4px_5px_rgba(138,90,60,0.25)]"
        >
          <div className="flex w-[173px] flex-col items-center justify-center gap-[11px]">
            <p
              id="friend-delete-title"
              className="w-[154px] text-center text-[16px] font-normal break-words text-[#3E281B]"
            >
              ‘{friendName}’님 을
              <br />
              정말 삭제하시겠습니까?
            </p>

            <div className="flex items-center gap-[9px]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={onConfirm}
                className="flex h-[22px] w-[33px] items-center justify-center rounded-[5px] bg-[#9E2A2B] px-2.5 text-[13px] font-medium text-[#F9F6F0] disabled:opacity-40"
              >
                예
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={onCancel}
                className="flex h-[22px] w-[59px] items-center justify-center rounded-[5px] bg-white px-2.5 text-[13px] font-medium text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A] disabled:opacity-40"
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage

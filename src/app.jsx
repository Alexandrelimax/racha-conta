import { useState } from "react"
const FormSplitBill = ({ friend, onHandleSplitBill }) => {
  const [payer, setPayer] = useState("Você")

  const handleSubmitBill = (e) => {
    e.preventDefault()
    const { total, myExpenses } = e.target.elements
    const diff = total.value - myExpenses.value
    const status = payer === "Você"
    const MessageStatus = status
      ? `Te deve ${diff} reais`
      : `Você deve ${diff} reais`

    onHandleSplitBill(MessageStatus, friend, status)
  }

  return (
    <form
      className="p-2 sm:p-5 bg-zinc-700 rounded-md w-80 sm:w-96"
      onSubmit={handleSubmitBill}
    >
      <h2 className="text-xl font-bold">Rache a conta com {friend}</h2>
      <div className="flex justify-between my-3">
        <label>💰 Valor total</label>
        <input
          className="bg-slate-50 py-1 text-black rounded-sm text-center"
          type="text"
          name="total"
        />
      </div>
      <div className="flex justify-between my-3">
        <label>🍺 Seus Gastos</label>
        <input
          className="bg-slate-50  py-1 text-black rounded-sm text-center"
          type="text"
          name="myExpenses"
        />
      </div>
      <div className="flex justify-between my-3">
        <label>🤑 Quem vai pagar?</label>
        <select
          className="bg-white text-black py-2 text-center px-1 rounded-sm font-bold "
          name={payer}
          onChange={(e) => setPayer(e.target.value)}
        >
          <option value="Você">Você</option>
          <option value={friend}>{friend}</option>
        </select>
      </div>
      <button className="bg-teal-500 py-1 font-bold rounded-md w-full">
        Rachar Conta
      </button>
    </form>
  )
}

const App = () => {
  const [showFormFriend, setShowFormFriend] = useState(false)
  const [showFormBill, setShowFormBill] = useState(null)
  const [listOfFriend, setListOfFriend] = useState([])
  const [friend, setFriend] = useState("")

  const handleShowAddFriend = () => {
    setShowFormFriend(!showFormFriend)
  }
  const handleSplitBill = (messageStatus, friendName, status) => {
    setListOfFriend(
      listOfFriend.map((friend) => {
        return friend.name === friendName
          ? { ...friend, status: messageStatus, debt: status }
          : friend
      }),
    )
  }
  const handleShowFormBill = (friendId) => {
    const choosenFriend = listOfFriend.reduce(
      (acc, friend) => (friend.id === friendId ? acc + friend.name : acc),
      "",
    )
    if (showFormBill === choosenFriend) {
      setShowFormBill(null)
    } else {
      setFriend(choosenFriend)
      setShowFormBill(choosenFriend)
    }
  }
  const handleAddNewFriend = (e) => {
    e.preventDefault()
    const { name, photo } = e.target.elements
    console.log(name.value, photo.value)
    const newFriend = {
      id: crypto.randomUUID(),
      name: name.value,
      photo: `/${photo.value}.jpg`,
      status: "Estão quites",
    }
    setListOfFriend((prev) => [...prev, newFriend])
  }

  return (
    <div>
      <div className="text-center">
        <div className="w-72 m-auto mt-24">
          <img src="/logo-racha-conta.png" alt="" />
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-10 flex-wrap mx-5">
        <div className="w-80">
          <ul>
            {listOfFriend.map((friend) => (
              <ListFriend
                key={friend.id}
                friend={friend}
                showFormBill={showFormBill === friend.name}
                onHandleShowFormBill={handleShowFormBill}
              />
            ))}
          </ul>
          {showFormFriend && (
            <form
              className="bg-zinc-600 flex flex-col gap-2 mb-5 p-2 rounded-md"
              onSubmit={handleAddNewFriend}
            >
              <div className="flex justify-between">
                <label>🧍🏻‍♂️ Nome</label>
                <input
                  className="bg-slate-50 text-black rounded-sm"
                  type="text"
                  name="name"
                />
              </div>
              <div className="flex justify-between">
                <label>📷 Foto</label>
                <input
                  className="bg-slate-50 text-black rounded-sm"
                  type="text"
                  name="photo"
                />
              </div>
              <button className="bg-teal-500 py-1 w-full rounded-md">
                Adicionar
              </button>
            </form>
          )}
          <button
            className={
              showFormFriend
                ? "bg-red-500 py-1  rounded-lg w-full"
                : "bg-green-400 py-1  rounded-lg w-full"
            }
            onClick={handleShowAddFriend}
          >
            {showFormFriend ? "Fechar" : "Adicionar amigo(a)"}
          </button>
        </div>
        <div>
          {showFormBill && (
            <FormSplitBill
              friend={friend}
              onHandleSplitBill={handleSplitBill}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const ListFriend = ({ friend, showFormBill, onHandleShowFormBill }) => {
  return (
    <li
      className="flex justify-between items-center p-2 mb-3"
      key={friend.name}
    >
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <img
            className="rounded-full overflow-hidden w-16 h-16  object-cover"
            src={friend.photo}
            alt="foto amigo(a)"
          />
        </div>
        <div>
          <p className="font-bold text-lg">{friend.name}</p>
          {"debt" in friend ? (
            <p className={friend.debt ? " text-green-600" : " text-red-500"}>
              {friend.status}
            </p>
          ) : (
            <p>{friend.status}</p>
          )}
        </div>
      </div>
      <button
        className={
          showFormBill
            ? "bg-red-500 py-1 pb-2 px-2 rounded-md"
            : "bg-teal-500 py-1 pb-2 px-2 rounded-md"
        }
        onClick={() => onHandleShowFormBill(friend.id)}
      >
        {showFormBill ? "Fechar" : "selecionar"}
      </button>
    </li>
  )
}

export { App }

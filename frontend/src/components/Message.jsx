
function Message({ msg, time, userName, chatColor}) {
    return (
      // Message container
      <div 
        className={`flex justify-center items-center rounded-md w-fit my-1 `}
      >
          <div
            className="flex justify-evenly items-end max-w-[410px] p-2 break-words bg-[#202d33] rounded-md shadow-md"
          >
            <p className={`${chatColor} font-bold text-sm mr-2 truncate`}>{userName}: <br></br><span className="text-white">{msg.substring(0,50)}</span></p>
            <p className="text-[#8796a1] text-[10px] min-w-[50px]">{time}</p>
          </div>
      </div>
    );
  }
  
  export default Message;
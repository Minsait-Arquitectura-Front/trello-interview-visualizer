import React from "react";
import "./Dashboard.scss";

const Dashboard = ({ data }) => {
  // Calculate the start date (a month before today)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // States
  const [startDate, setStartDate] = React.useState(oneMonthAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [openedCards, setOpenedCards] = React.useState([]);
  const [filteredCards, setFilteredCards] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [userSelected, setUserSelected] = React.useState(null);
  const [lists, setLists] = React.useState([]);

  // Calculate the number of days between start and end dates
  const getDaysDifference = (start, end) => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Aux functions
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const showUserData = (member) => {
    setUserSelected(member);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const getColumnFromId = (id) => {
    const item = lists.find((item) => item.id === id);
    return item ? item.name : "SIN COLUMNA";
  };

  const applyFilters = React.useCallback((filteredCardsNotClosed, startDate, endDate, members) => {
    const filteredCardsByDate = filteredCardsNotClosed.filter((card) => {
      let dateOfExpiration = card.due ? new Date(card.due) : new Date(0);
      return dateOfExpiration >= new Date(startDate) && dateOfExpiration <= new Date(endDate);
    });

    let membersWithCards = members.map((member) => ({
      memberInfo: member,
      cards: filteredCardsByDate.filter((card) => card.idMembers.includes(member.id)),
    }));

    membersWithCards = membersWithCards.sort((member1, member2) => {
      return member2.cards.length - member1.cards.length;
    });

    setMembers(membersWithCards);
    setFilteredCards(filteredCardsByDate);
  }, []);

  React.useEffect(() => {
    if (data) {
      const filteredCardsNotClosed = data.cards.filter((card) => !card.closed);
      setOpenedCards(filteredCardsNotClosed);
      setLists(data.lists);
      applyFilters(filteredCardsNotClosed, startDate, endDate, data.members);
    }
  }, [data, startDate, endDate, applyFilters]);

  return (
    <div className="dashboard">
      <h3 className="dashboard__title">Filtros:</h3>
      <form className="filters" onSubmit={onSubmit}>
        <div className="row">
          <div className="row__col">
            <p>Desde:</p>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="row__col">
            <p>Hasta:</p>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <input className="filters__button" type="submit" value="FILTRAR" />
      </form>
      <p className="dashboard__count">
        Total tarjetas: {openedCards?.length} / Filtradas: {filteredCards?.length} <br />
        Mostrando ultimos {getDaysDifference(startDate, endDate)} días.
      </p>

      <table className="custom-table custom-table--small">
        <thead className="custom-table__head">
          <tr className="custom-table__row">
            <th className="custom-table__th">Usuario</th>
            <th className="custom-table__th">Num tarjetas</th>
            <th className="custom-table__th">Acciones</th>
          </tr>
        </thead>
        <tbody className="custom-table__body">
          {members.map((member) => (
            <tr key={member.memberInfo.id} className="custom-table__row">
              <td className="custom-table__td">
                {member.memberInfo.fullName} ({member.memberInfo.username})
              </td>
              <td className="custom-table__td">{member.cards.length}</td>
              <td className="custom-table__td">
                <button onClick={() => showUserData(member)}>VER DETALLE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userSelected?.cards && (
        <>
          <p>
            Detalle del usuario {userSelected?.memberInfo?.fullName} ({userSelected?.memberInfo?.username})
          </p>
          <table className="custom-table">
            <thead className="custom-table__head">
              <tr className="custom-table__row">
                <th className="custom-table__th">Titulo</th>
                <th className="custom-table__th">Fecha</th>
                <th className="custom-table__th">Columna</th>
              </tr>
            </thead>
            <tbody className="custom-table__body">
              {userSelected.cards.map((card) => (
                <tr key={card.id} className="custom-table__row">
                  <td className="custom-table__td">{card.name}</td>
                  <td className="custom-table__td">{card.due}</td>
                  <td className="custom-table__td">{getColumnFromId(card.idList)}</td>
                  <td className="custom-table__td">
                    <a rel="noreferrer" target="_blank" href={card.url}>
                      LINK
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Dashboard;

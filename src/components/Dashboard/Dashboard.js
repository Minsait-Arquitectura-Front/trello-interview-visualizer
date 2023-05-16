import React from "react";
import "./Dashboard.scss";
import { getDaysBetweenDates } from "../../utils/dates";

const Dashboard = ({ data }) => {
  // Dias: 1 día, 3 días
  // Semanas: 1s -> 7d, 2s -> 14d, 4s -> 28d
  // Meses: 3m -> 90d, 6m -> 180d, 12m -> 365d
  const lastDaysFilterOptions = [1, 3, 7, 14, 28, 60, 90, 180, 365];

  // States
  const [lastDaysFilterValue, setLastDaysFilterValue] = React.useState(7);
  const [openedCards, setOpenedCards] = React.useState([]);
  const [filteredCards, setFilteredCards] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [userSelected, setUserSelected] = React.useState(null);
  const [lists, setLists] = React.useState([]);

  // References
  const lastDaysFilterRef = React.useRef(null);

  // Aux functions
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setLastDaysFilterValue(parseInt(lastDaysFilterRef.current.value, 10));
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

  const applyFilters = React.useCallback((filteredCardsNotClosed, lastDaysFilterValue, members) => {
    // Filtramos tarjetas por fecha
    const currentDate = new Date();
    const filteredCardsByDate = filteredCardsNotClosed.filter((card) => {
      // Default: 1970
      let dateOfExpiration = card.due ? new Date(card.due) : new Date(0);
      const days = getDaysBetweenDates(currentDate, dateOfExpiration);
      return days <= lastDaysFilterValue;
    });

    // Asignamos tarjetas a cada usuario
    let membersWithCards = members.map((member) => ({
      memberInfo: member,
      cards: filteredCardsByDate.filter((card) => card.idMembers.includes(member.id)),
    }));

    // Ordenamos por mayor número de tarjetas
    membersWithCards = membersWithCards.sort((member1, member2) => {
      return member2.cards.length - member1.cards.length;
    });

    setMembers(membersWithCards);

    setFilteredCards(filteredCardsByDate);
  }, []);

  // Efectos
  React.useEffect(() => {
    if (data) {
      // Remove closed cards
      const filteredCardsNotClosed = data.cards.filter((card) => !card.closed);
      setOpenedCards(filteredCardsNotClosed);
      setLists(data.lists);
      applyFilters(filteredCardsNotClosed, lastDaysFilterValue, data.members);
    }
  }, [data, lastDaysFilterValue, applyFilters]);

  return (
    <div className="dashboard">
      <h3 className="dashboard__title">Filtros:</h3>
      <form className="filters" onSubmit={onSubmit}>
        <div className="row">
          <div className="row__col">
            <p>Últimos n días:</p>
            <select defaultValue={lastDaysFilterValue} ref={lastDaysFilterRef} type="select">
              {lastDaysFilterOptions.map((days) => (
                <option key={days} id={days} value={days}>
                  {days}
                </option>
              ))}
            </select>
          </div>

          <div className="row__col">{/* PONER AQUI RESTO DE FILTROS */}</div>
        </div>

        <input className="filters__button" type="submit" value="filtrar" />
      </form>

      <p>
        Total tarjetas: {openedCards?.length} / Filtradas: {filteredCards?.length}
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

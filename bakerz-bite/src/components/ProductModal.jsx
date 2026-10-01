import Modal from 'react-bootstrap/Modal';
import { asset, formatPrice } from '../data/catalog.js';
import { Badges, Stars } from './ui.jsx';

/**
 * Spec: clicking any item opens a pop-up window showing the product image
 * along with its description and detailed specification (ingredients).
 * Shared by both the food menu and the merchandise shelf.
 */
export default function ProductModal({ item, currency, onHide }) {
  const open = Boolean(item);

  return (
    <Modal
      show={open}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName="bb-modal"
      aria-labelledby="bb-modal-title"
    >
      {item ? (
        <div className="bb-modal__grid">
          <div className="bb-modal__media">
            <Badges items={item.badges} />
            <img src={asset(item.image)} alt={item.name} />
          </div>

          <div className="bb-modal__body">
            <button
              type="button"
              className="bb-modal__close"
              onClick={onHide}
              aria-label="Close"
            >
              ×
            </button>

            <span className="bb-card__cat">{item.category}</span>
            <h3 className="bb-modal__title" id="bb-modal-title">
              {item.name}
            </h3>

            <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
              <span className="bb-price">
                {formatPrice(item.price, currency)}
                <small>/ {item.unit}</small>
              </span>
              <Stars value={item.rating} count={item.reviews} />
            </div>

            <p className="bb-modal__lead">{item.description}</p>

            {item.dietary?.length ? (
              <div className="d-flex gap-2 flex-wrap mt-3">
                {item.dietary.map((d) => (
                  <span key={d} className="bb-diet">
                    {d.replace('-', ' ')}
                  </span>
                ))}
              </div>
            ) : null}

            {item.ingredients?.length ? (
              <>
                <h4 className="bb-modal__sub">Ingredients</h4>
                <ul className="bb-ing">
                  {item.ingredients.map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
              </>
            ) : null}

            <h4 className="bb-modal__sub">Detailed specification</h4>
            <table className="bb-spec">
              <tbody>
                {Object.entries(item.specifications ?? {}).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {item.allergens?.length ? (
              <div className="bb-allergen">
                <strong>Allergens:</strong>
                <span>
                  Contains {item.allergens.join(', ').toLowerCase()}. Prepared in a
                  kitchen that handles nuts, gluten, dairy and egg daily.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

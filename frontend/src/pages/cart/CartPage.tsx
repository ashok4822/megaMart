import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "../../store/slices/cartSlice";
import api from "../../api/axiosInstance";
import type { ShippingAddress } from "../../types";
import toast from "react-hot-toast";
import "./CartPage.css";

const INITIAL_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { cart, loading } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);

  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  const handleQtyChange = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    const result = await dispatch(updateCartItem({ itemId, quantity: qty }));
    if (updateCartItem.rejected.match(result)) {
      toast.error((result.payload as string) || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId: string) => {
    const result = await dispatch(removeCartItem(itemId));
    if (removeCartItem.fulfilled.match(result)) toast.success("Item removed");
    else toast.error("Failed to remove item");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error("Please fill all required address fields");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data } = await api.post("/orders", { shippingAddress: address });
      if (data.success) {
        setOrderSuccess(data.data._id);
        toast.success("Order placed successfully! 🎉");
        setShowCheckout(false);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Checkout failed. Please try again.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!user)
    return (
      <div className="empty-state" id="cart-auth-prompt">
        <div className="empty-state__icon">🔒</div>
        <h1 className="empty-state__title">Sign in to view your cart</h1>
        <p className="empty-state__desc">
          Your cart is saved server-side and synced across devices when you sign
          in.
        </p>
        <Link
          to="/auth/login"
          className="btn btn-primary btn-lg"
          id="cart-signin-btn"
        >
          Sign In
        </Link>
      </div>
    );

  if (orderSuccess)
    return (
      <div className="cart-success" id="order-success">
        <div className="cart-success__icon">✅</div>
        <h1>Order Placed!</h1>
        <p>
          Your order <strong>#{orderSuccess.slice(-8).toUpperCase()}</strong>{" "}
          has been confirmed.
        </p>
        <p className="cart-success__sub">We'll notify you when it ships.</p>
        <div className="cart-success__actions">
          <Link
            to="/products"
            className="btn btn-primary btn-lg"
            id="continue-shopping-btn"
          >
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-outline" id="view-orders-btn">
            View Orders
          </Link>
        </div>
      </div>
    );

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className="cart-page" id="cart-page">
      <div className="container">
        <h1 className="cart-page__title">Shopping Cart</h1>

        {loading && !cart ? (
          <div className="cart-loading">
            <div className="spinner" />
          </div>
        ) : isEmpty ? (
          <div className="empty-state" id="empty-cart">
            <div className="empty-state__icon">🛒</div>
            <h2 className="empty-state__title">Your cart is empty</h2>
            <p className="empty-state__desc">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/products"
              className="btn btn-primary btn-lg"
              id="start-shopping-btn"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items" id="cart-items-list">
              {cart!.items.map((item) => (
                <article
                  key={item._id}
                  className="cart-item"
                  id={`cart-item-${item._id}`}
                >
                  <img
                    src={
                      item.productSnapshot?.image ||
                      "https://placehold.co/80x80?text=?"
                    }
                    alt={item.productSnapshot?.name}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <Link
                      to={`/products/${item.productSnapshot?.slug}`}
                      className="cart-item__name"
                      id={`cart-item-name-${item._id}`}
                    >
                      {item.productSnapshot?.name}
                    </Link>
                    <p className="cart-item__sku">Variant: {item.variantSku}</p>

                    {/* Stale cart warning */}
                    {item.quantity > 0 && (
                      <p className="cart-item__stale-hint">
                        Added at ₹{item.priceAtAdd.toLocaleString("en-IN")} ·
                        Current price may differ
                      </p>
                    )}
                  </div>

                  <div className="cart-item__controls">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        id={`qty-dec-${item._id}`}
                        onClick={() =>
                          handleQtyChange(item._id, item.quantity - 1)
                        }
                        disabled={loading || item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span id={`qty-val-${item._id}`}>{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        id={`qty-inc-${item._id}`}
                        onClick={() =>
                          handleQtyChange(item._id, item.quantity + 1)
                        }
                        disabled={loading}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p
                      className="cart-item__price"
                      id={`item-total-${item._id}`}
                    >
                      ₹
                      {(item.priceAtAdd * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                    <button
                      className="cart-item__remove"
                      id={`remove-${item._id}`}
                      onClick={() => handleRemove(item._id)}
                      disabled={loading}
                      aria-label="Remove item"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="cart-summary" id="order-summary">
              <div className="cart-summary__card">
                <h2>Order Summary</h2>
                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Items ({cart!.itemCount})</span>
                    <span id="subtotal-amount">
                      ₹{cart!.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Delivery</span>
                    <span className="cart-summary__free">FREE</span>
                  </div>
                  <div className="cart-summary__divider" />
                  <div className="cart-summary__row cart-summary__row--total">
                    <strong>Total</strong>
                    <strong id="total-amount">
                      ₹{cart!.subtotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    className="btn btn-primary btn-full btn-lg"
                    id="proceed-checkout-btn"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout →
                  </button>
                ) : (
                  <form
                    className="checkout-form"
                    onSubmit={handleCheckout}
                    id="checkout-form"
                  >
                    <h3>Delivery Address</h3>

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        id="addr-fullname"
                        className="form-input"
                        placeholder="John Doe"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress({ ...address, fullName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        id="addr-phone"
                        className="form-input"
                        placeholder="9876543210"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 1 *</label>
                      <input
                        id="addr-line1"
                        className="form-input"
                        placeholder="House/Flat no., Street"
                        value={address.addressLine1}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            addressLine1: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 2</label>
                      <input
                        id="addr-line2"
                        className="form-input"
                        placeholder="Landmark (optional)"
                        value={address.addressLine2}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            addressLine2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="checkout-form__row">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          id="addr-city"
                          className="form-input"
                          placeholder="Mumbai"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input
                          id="addr-pincode"
                          className="form-input"
                          placeholder="400001"
                          maxLength={6}
                          value={address.pincode}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              pincode: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        id="addr-state"
                        className="form-input"
                        placeholder="Maharashtra"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="checkout-form__actions">
                      <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        id="place-order-btn"
                        disabled={checkoutLoading}
                      >
                        {checkoutLoading
                          ? "⏳ Placing Order..."
                          : "✅ Place Order"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-full"
                        onClick={() => setShowCheckout(false)}
                        id="cancel-checkout-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

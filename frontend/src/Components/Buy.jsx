import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils';

function Buy() {
  const { clothId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [cloth, setCloth] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState("")

  useEffect(() => {
    const fetchBuyClothData = async () => {
      if (!token) {
        toast.error("Please login to purchase the item");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.post(`${BACKEND_URL}/cloth/buy/${clothId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        console.log(response.data)
        setCloth(response.data.cloth);
        setClientSecret(response.data.clientSecret);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false)
        if (error?.response?.status === 400) {
          toast.error("You have already purchased this item")
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.message)
        }
      }
    }
    fetchBuyClothData();
  }, [clothId])

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element Not Found")
      return;
    }

    setIsLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card Element Not Found");
      setIsLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe payment method error', error);
      setIsLoading(false);
      setCardError(error.message);
    } else {
      console.log('Payment Method Created!', paymentMethod);
    }

    if (!clientSecret) {
      console.log("No ClientSecret Found");
      setIsLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment Succeeded: ", paymentIntent);
      setCardError("Your Payment id: " + paymentIntent.id); // string fix

      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        clothId: clothId,
        payemntId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status
      };

      console.log("Payment info: ", paymentInfo);

      await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
        .then(response => {
          console.log(response.data)
        }).catch((error) => {
          console.log(error)
          toast.error("Error in making payment")
        })

      toast.success("Payment Successfull")
      navigate("/purchases")
    }

    setIsLoading(false);
  }; 

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${cloth.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{cloth.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {isLoading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;

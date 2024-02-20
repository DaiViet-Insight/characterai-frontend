import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import './PaymentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const serverUrl = "http://localhost:3005";

const toVND = (price) => {
    try {
        return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    } catch {
        return 0;
    }
}

const paymentMethods = [
    {
        id: 1,
        name: 'ShopeePay',
        img: 'https://cdn.garenanow.com/webmain/static/payment_center/vn/menu/vnshopeepay_pc.png'
    },
    {
        id: 2,
        name: 'MasterCard',
        img: 'https://www.mastercard.com.vn/content/dam/mccom/global/logos/logo-mastercard-mobile.svg'
    },
    {
        id: 3,
        name: 'Viettel',
        img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/VT-SMS.png'
    },
    {
        id: 4,
        name: 'Mobifone',
        img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/Mobifone-SMS.png'
    },
    {
        id: 5,
        name: 'ZaloPay',
        img: 'https://dms.inet.vn/uploads/public/2021/06/03/1622682588188_zalopay.png'
    },
    {
        id: 6,
        name: 'ATM',
        img: 'https://cdn-gop.garenanow.com/webmain/static/payment_center/vn/menu/vn_new_atm_140x87.png'
    }
]

const PaymentPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState({});

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/characters/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await response.json();
                setCharacter(data);
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchCharacter();
    }, [id]);

    const [paymentMethod, setPaymentMethod] = useState(null);

    return (
        <div className="payment-page">
            <div className="payment-page-container">
                <Link to={`../../`} className="back-link">
                    <div className="payment-page__header">
                        <div className="payment-page__header__back">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <span className="payment-page__header__title">Quay lại Trang chủ</span>
                    </div>
                </Link>
                <div className="payment-page__row">
                    <div className="payment-page-row__info-character">
                        <div className="payment-page__info-character__img">
                            <img src={`${serverUrl}${character.avatar}`} alt="character" />
                        </div>
                        <div className="payment-page__info-character__name">
                            {character.name}
                        </div>
                    </div>
                    <div className="payment-page-row__line-separate"></div>
                    <div className="payment-page-row__price">
                        Giá: {toVND(character.price)}
                    </div>
                </div>
                <div className="payment-page__content">
                    <div className="payment-page__content__title">
                        Chọn phương thức thanh toán
                    </div>
                    <div className="payment-page__content__methods">
                        {paymentMethods.map(method => (
                            <div key={method.id} className={paymentMethod === method.id ? "payment-page__content__methods__item active" : "payment-page__content__methods__item"}
                                onClick={() => setPaymentMethod(method.id)}
                            >
                                <img src={method.img} alt={method.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
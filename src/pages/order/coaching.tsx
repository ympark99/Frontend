import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import { Layout } from "components/layout";
import { Button, ToggleBtn, Colors } from "components/ui";
import { bootpay } from "components/bootpay";
import { withRouter } from 'next/router';
import { useRouter } from 'next/router';
import { priceFormat } from "components/formatter";
import { InputPhone } from "components/input-phone";
import { InputName } from "components/input-name";
import { AgreePage } from "components/agree";
import { Step } from "components/step";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { itemId, optionId, userId } = context.query;
  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pay/checkorder/${userId}?itemId=${itemId}&optionId=${optionId}`);
  return {
    props: { data: result.data.order_receipts },
  }
}

function OrderCoaching({data}: InferGetServerSidePropsType<typeof getServerSideProps>){
  // 약관 동의 모달
  const [AgreeModal, setAgreeModal] = useState<boolean>(false);

  function onClickListener(){
    setAgreeModal(true);
    document.body.style.overflow = 'hidden';
  }

  //오류 판별 및 리다이렉트
  const error = window.location.pathname === '/order';
  const router = useRouter();
  useEffect(() => {
    if(!error){
      router.push('/404');
    }
  },[]);

  // 주문서 추가 정보(입력폼 정보)
  const [pg, setPg] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userNameState, setUserNameState] = useState<boolean>(false);
  const [userPhone, setUserPhone] = useState<string>('');
  const [userPhoneState, setUserPhoneState] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);

  //구매하기 버튼 클릭 시, 유저 정보 넘기고 부트페이 실행
  async function tryPay() {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/userinfo`, {
        orderId: data.orderId,
        userId: data.userId,
        userName: userName,
        userPhone: userPhone
      });
      console.log('save userinfo: ', res);
      bootpay(data, {method: method, pg: pg, userName: userName, userPhone: userPhone});
    } catch (error) {
      console.error(error);
    }
  }

  // Step 활성화 useState
  const [crntStep, changeStep] = useState<number>(1);

  return (
    <Layout noFooter>
      {                
        AgreeModal ? <AgreePage setActiveTab="refund" setAgreeModal={setAgreeModal}/> : null
      }
      <Wrap>
        <Step active={crntStep} labels={["스케줄 선택", "개인정보 입력", "결제하기", "결제 완료"]}/>
        {
          crntStep === 1 ? (
            <>
              <Container>
                <ScheduleSection />
              </Container>
              <Buttons>
                <Button type="secondary" onClick={()=>window.history.back()}>이전</Button>
                <Button type="start" onClick={()=>changeStep(2)}>다음</Button>
              </Buttons>
            </>
          ) : null
        }
        {
          crntStep === 2 ? (
            <>
              <Container>
                <OrdererSection userName={userName}
                                setUserName={setUserName}
                                setUserNameState={setUserNameState}
                                userPhone={userPhone}
                                setUserPhone={setUserPhone}
                                setUserPhoneState={setUserPhoneState} />
              </Container>
              <Buttons>
                <Button type="secondary" onClick={()=>changeStep(1)}>이전</Button>
                <Button type="start" disabled={userNameState && userPhoneState ? false : 'disabled'} onClick={()=>changeStep(3)}>결제하기</Button>
              </Buttons>
            </>
          ) : null
        }
        {
          crntStep === 3 ? (
            <>
              <Container>
                <PaymentSection itemInfo={data.itemInfo} />
                <Hr/>
                <PaymentSectionMethod pg={pg}
                                      setPg={setPg}
                                      method={method}
                                      setMethod={setMethod} />
                <PaymentSectionAgree agree={agree}
                                     setAgree={setAgree}
                                     onClickListener={onClickListener} />
              </Container>
              <Buttons>
                <Button type="secondary" onClick={()=>changeStep(2)}>이전</Button>
                <Button type="start" disabled={pg && method && agree ? false : 'disabled' } onClick={pg && method && agree ? tryPay : ()=>console.log('실행불가')}>결제하기</Button>
              </Buttons>
            </>
          ) : null
        }
      </Wrap>
    </Layout>
  )
}
export default withRouter(OrderCoaching);

const Wrap = styled.div`
  padding: 0 40px;
  margin: 0 auto;
  width: 100%;
  max-width: 916px;
`;

const Container = styled.div`
  background: ${Colors.white};
  width: 100%;
  margin-top: 24px;
  padding: 24px 36px 12px;
  border-radius: 20px;
  box-shadow: 0px 8px 16px rgba(17, 17, 17, 0.06);
`;

const Headline = styled.div`
  display: flex;
  align-items: baseline;
`;
const Title = styled.h2`
  font-weight: 700;
  line-height: 32px;
  font-size: 20px;
  word-break: keep-all;
  white-space: nowrap;
`
const Desc = styled.p`
  line-height: 26px;
  font-size: 16px;
  word-break: keep-all;
  margin-left: 20px;
`

const Textarea = styled.textarea`
  width: 100%;
  height: 183px;
  padding: 20px;
  border: 1px ${Colors.gray3} solid;
  border-radius: 20px;
  font-size: 14px;
  line-height: 24px;
  resize: none;
  margin-top: 20px;

  &::placeholder {
    color: ${Colors.gray3}
  }
`;

const Characters = styled.p`
  margin-bottom: 52px;
  text-align: right;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
`;

const UserInfo = styled.div`
  padding: 36px 0 26px;

  label {
    display: block;
    font-size: 16px;
    margin-bottom: 16px;
  }
  input {
    width: 100%;
    height: 52px;
    font-size: 16px;
    padding: 12px 24px;
    border-radius: 20px;
    border: 1px solid ${Colors.gray3};

    &::placeholder {
      color: ${Colors.gray3}
    }
  }

  div + div {
    margin-top: 32px;
  }
`;

const Hr = styled.hr`
  border: 0px;
  border-bottom: 1px ${Colors.gray3} solid;
  margin: 0;
`;

const Buttons = styled.div`
  display: flex;
  margin: 60px -6px 86px;

  button {
    flex-basis: 50%;
    flex-grow: 1;
    margin: 0 6px;
  }
`;

function ScheduleSection(){
  return (
    <section>
      <Headline>
        <Title>코칭 신청</Title>
        <Desc>2주 내에 코칭받을 수 있는 일정을 모두 선택해주세요. 요일 선택 뒤, 시간 선택이 가능합니다.</Desc>
      </Headline>
    </section>
  )
}

function OrdererSection({userName, setUserName, setUserNameState, userPhone, setUserPhone, setUserPhoneState}: any){
  return (
    <section>
      <Headline>
        <Title>상담 내용</Title>
        <Desc>코치에게 전하는 말을 남겨주세요.</Desc>
      </Headline>
      <Textarea placeholder="지금 고민하고 있는 부분이나 코치님에게 어떤 상담/교육을 받고 싶은지 구체적으로 작성해주세요."></Textarea>
      <Characters>0/200</Characters>
      <Headline>
        <Title>신청하시는 분 정보</Title>
        <Desc>입력하신 연락처로 코칭 진행에 대해 자세히 안내드립니다.</Desc>
      </Headline>
      <UserInfo>
        <div>
          <label>이름</label>
          <InputName useState={userName} useStateFunction={setUserName} formStateFunction={setUserNameState} />
        </div>
        <div>
          <label>연락처</label>
          <InputPhone useState={userPhone} useStateFunction={setUserPhone} formStateFunction={setUserPhoneState} />
        </div>
      </UserInfo>
    </section>
  )
}


const Section = styled.section`
  padding: 24px 0; 
`

function PaymentSection({itemInfo}: any){
  const OrderInfo = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 39px;
  `;
  const ItemImg = styled.img`
  width: 172px;
  height: 96px;
  border-radius: 10px;
`
const OrderInfoText = styled.div`
  margin-left: 36px;
`;
const ItemTitle = styled.h3`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 10px;
`;
const Type = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: ${Colors.primary};
`

const PriceInfo = styled.dl`
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  line-height: 40px;
  margin-top: 26px;
  margin-bottom: -10px;

  dt {
    width: 200px;
  }
  dd {
    width: calc(100% - 200px);
    text-align: right;
    font-weight: 500;
  }
  .finalPrice {
    color: ${Colors.primary};
    font-weight: 500;
  }
`;

  return (
    <>
    <Section>
      <Headline>
        <Title>주문 정보</Title>
        <Desc>주문 정보를 다시 한번 확인해주세요.</Desc>
      </Headline>
      <OrderInfo>
        <ItemImg src={`/detail/${itemInfo.itemId}/thumb.png`}/>
        <OrderInfoText>
          <ItemTitle>{itemInfo.itemName}</ItemTitle>
          {
            itemInfo.option.type === "workbook" ?
            <Type>[워크북] 업무에 활용했던 자료들입니다.</Type> :
            <Type>[코칭] {itemInfo.option.title}</Type>
          }
        </OrderInfoText>
      </OrderInfo>
    </Section>
    <Hr/>
    <Section>
      <Headline>
        <Title>결제 정보</Title>
      </Headline>
      <PriceInfo>
        <dt>상품 금액</dt>
        <dd>{priceFormat(itemInfo.option.price)}원</dd>
        <dt>할인 금액</dt>
        <dd>{priceFormat(itemInfo.option.discountPrice - itemInfo.option.price)}원</dd>
        <dt className="finalPrice">최종 결제금액</dt>
        <dd className="finalPrice">{priceFormat(itemInfo.option.discountPrice)}원</dd>
      </PriceInfo>
    </Section>
    </>
  )
}

function PaymentSectionMethod({method, setMethod, pg, setPg}: any){
const Methods = styled.div`
  display: flex;
  margin: 0 -5px;
  margin-top: 20px;
  margin-bottom: 12px;

  > button {
    flex-grow: 1;
    margin: 0 5px;
  }
`;

  return (
    <Section>
      <Headline>
        <Title>결제 수단</Title>
      </Headline>
      <Methods>
        <ToggleBtn className={method === 'card' ? 'active' : ''}
                  onClick={()=>{setPg('danal');setMethod('card');}}>카드결제</ToggleBtn>
        <ToggleBtn className={pg === 'kakao' ? 'active' : ''}
                  onClick={()=>{setPg('kakao');setMethod('easy');}}>카카오페이</ToggleBtn>
        <ToggleBtn className={pg === 'npay' ? 'active' : ''}
                  onClick={()=>{setPg('npay');setMethod('');}}>네이버페이</ToggleBtn>
      </Methods>
    </Section>
  )
}

function PaymentSectionAgree({agree, setAgree, onClickListener}: any){
const Agree = styled.div`
  font-size: 14px;
  text-align: center;
  margin-bottom: 3px;

  input[type=checkbox] {
    display: none;
  }
  input[type=checkbox] + label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-right: 15px;
    border-radius: 4px;
    border: 1px solid #6E7191;
  }
  input[type=checkbox]:checked + label::before {
    border-color: ${Colors.primary};
    background: url('/icon/done_24px.svg') center/17px 13px no-repeat;
    background-color: ${Colors.primary};
  }
  input[type=checkbox] + label {
    cursor: pointer;
  }

  .highlight {
    color: ${Colors.primary};
    border-bottom: 1px ${Colors.primary} solid;
    cursor: pointer;
  }
`;

  return (
    <Section style={{paddingTop: '14px'}}>
      <Agree>
        <input id="ag" type="checkbox" onClick={()=>setAgree(!agree)} checked={agree} />
        <label htmlFor="ag">주문 내용을 확인하였으며, <label className="highlight" onClick={onClickListener}>서비스 취소/환불 정책</label> 및 결제에 동의합니다. (필수)</label>
      </Agree>
    </Section>
  )
}

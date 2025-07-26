import cypressConfig from "../../cypress.config";

describe("결제 프로세스", () => {
  beforeEach(() => {
    cy.visit("/payment", {
      onBeforeLoad(win) {
        win.Cypress = win.Cypress || {};
        window.Cypress.mockUser = {
          uid: "pay_user_001",
          email: "payuser@example.com",
          credits: 0,
        };
      },
    });
  });

  it("결제하기 버튼을 누르면 iframe이 뜨고, 결제 완료 후 서버 응답으로 credits이 반영된다", () => {
    // 1. 서버 응답 mock
    cy.intercept("POST", "http://localhost:4000/api/payment/complete", {
      statusCode: 200,
      body: {
        status: "PAID",
        id: "mocked-license-456",
      },
    }).as("paymentComplete");

    // 2. 결제하기 버튼 클릭
    cy.get('[data-cy="payment-btn"]').click();

    // 3. iframe이 뜨는지 확인
    cy.get("iframe#imp-iframe").should("exist");

    // 4. 실제 결재 성공 콜백을 Cypress에서 강제로 실행

    cy.window().then((win) => {
      return win.testTriggerPaymentComplete(
        "pay_user_001",
        "payuser@example.com"
      );
    });

    cy.wait("@paymentComplete");

    // 실제 은행 어플을 통하여 결제 사이클 진행 기다리는 시간
    cy.url({timeout : 100000}).should("include", "/dashboard");
    cy.contains("마이페이지").should("exist"); // 실제 표시 UI에 맞춰 수정

  });
});

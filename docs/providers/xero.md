openapi: 3.0.0
info:
  title: Xero Accounting API
  version: 9.0.0
  termsOfService: https://developer.xero.com/xero-developer-platform-terms-conditions/
  contact:
    name: Xero Platform Team
    email: api@xero.com
    url: https://developer.xero.com
servers:
  - description: The Xero Accounting API exposes accounting and related functions of the main Xero application and can be used for a variety of purposes such as creating transactions like invoices and credit notes, right through to extracting accounting data via our reports endpoint.
    url: https://api.xero.com/api.xro/2.0
paths:
  /Accounts:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
        type: string
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getAccounts
      summary: Retrieves the full chart of accounts
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status==&quot;ACTIVE&quot; AND Type==&quot;BANK&quot;
          x-example-csharp: Status==\"ACTIVE\"
          x-example-java: Status==&quot;&apos; + Account.StatusEnum.ACTIVE+ &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Account::STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Account::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Name ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Accounts array with 0 to n Account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Accounts'
              example:
                Accounts:
                  - AccountID: ebd06280-af70-4bed-97c6-7451a454ad85
                    Code: "091"
                    Name: Business Savings Account
                    Type: BANK
                    TaxType: NONE
                    EnablePaymentsToAccount: false
                    BankAccountNumber: "0209087654321050"
                    BankAccountType: BANK
                    CurrencyCode: NZD
                  - AccountID: 7d05a53d-613d-4eb2-a2fc-dcb6adb80b80
                    Code: "200"
                    Name: Sales
                    Type: REVENUE
                    TaxType: OUTPUT2
                    Description: Income from any normal business activity
                    EnablePaymentsToAccount: false
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createAccount
      summary: Creates a new chart of accounts
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - object:
          is_object: true
          key: account
          keyPascal: Account
        - code:
          key: code
          keyPascal: Code
          default: 123456
          object: account
        - name:
          key: name
          keyPascal: Name
          default: FooBar
          object: account
        - type:
          key: type
          keyPascal: Type
          default: EXPENSE
          nonString: true
          php: XeroAPI\XeroPHP\Models\Accounting\AccountType::EXPENSE
          node: AccountType.EXPENSE
          ruby: XeroRuby::Accounting::AccountType::EXPENSE
          python: AccountType.EXPENSE
          java: com.xero.models.accounting.AccountType.EXPENSE
          csharp: AccountType.EXPENSE
          object: account
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello World
          object: account
      responses:
        "200":
          description: Success - created new Account and return response of type Accounts array with new Account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Accounts'
              example:
                Id: 11814c9d-3b5e-492e-93b0-fad16bf3244f
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550793549392)/
                Accounts:
                  - AccountID: 66b262e2-561e-423e-8937-47d558f13442
                    Code: "123456"
                    Name: Foobar
                    Status: ACTIVE
                    Type: EXPENSE
                    TaxType: INPUT
                    Description: Hello World
                    Class: EXPENSE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    ReportingCode: EXP
                    ReportingCodeName: Expense
                    UpdatedDateUTC: /Date(1550793549320+0000)/
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - AccountID: 00000000-0000-0000-0000-000000000000
                    Code: "123456"
                    Name: Foobar
                    Type: EXPENSE
                    Description: Hello World
                    ValidationErrors:
                      - Message: Please enter a unique Name.
      requestBody:
        required: true
        description: Account object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Account'
            example:
              Code: "123456"
              Name: Foobar
              Type: EXPENSE
              Description: Hello World
  /Accounts/{AccountID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getAccount
      summary: Retrieves a single chart of accounts by using a unique account Id
      parameters:
        - $ref: '#/components/parameters/AccountID'
      responses:
        "200":
          description: Success - return response of type Accounts array with one Account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Accounts'
              example:
                Id: 323455cc-9511-4451-a873-248d2983f38e
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550797359081)/
                Accounts:
                  - AccountID: 99ce6032-0678-4aa0-8148-240c75fee33a
                    Code: "123456"
                    Name: FooBar
                    Status: ACTIVE
                    Type: EXPENSE
                    TaxType: INPUT
                    Description: Hello World
                    Class: EXPENSE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    ReportingCode: EXP
                    ReportingCodeName: Expense
                    UpdatedDateUTC: /Date(1550797359120+0000)/
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateAccount
      summary: Updates a chart of accounts
      x-hasAccountingValidationError: true
      x-example:
        - account:
          is_object: true
          key: account
          keyPascal: Account
        - code:
          key: code
          keyPascal: Code
          default: 123456
          object: account
        - name:
          key: name
          keyPascal: Name
          default: BarFoo
          object: account
        - type:
          key: type
          keyPascal: Type
          default: EXPENSE
          nonString: true
          php: XeroAPI\XeroPHP\Models\Accounting\AccountType::EXPENSE
          node: AccountType.EXPENSE
          ruby: XeroRuby::Accounting::AccountType::EXPENSE
          python: AccountType.EXPENSE
          java: com.xero.models.accounting.AccountType.EXPENSE
          csharp: AccountType.EXPENSE
          object: account
        - description:
          key: description
          keyPascal: Description
          default: Hello World
          object: account
        - taxType:
          is_last: true
          key: taxType
          keyPascal: TaxType
          keySnake: tax_type
          default: NONE
          object: account
        - accounts:
          is_object: true
          key: accounts
          keyPascal: Accounts
        - accounts:
          is_last: true
          is_array_add: true
          key: accounts
          keyPascal: Accounts
          java: Accounts
          csharp: Account
          object: account
      parameters:
        - $ref: '#/components/parameters/AccountID'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - update existing Account and return response of type Accounts array with updated Account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Accounts'
              example:
                Id: 9012e75c-ec08-40a9-ae15-153fc1f35c4d
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550795389340)/
                Accounts:
                  - AccountID: 99ce6032-0678-4aa0-8148-240c75fee33a
                    Code: "654321"
                    Name: BarFoo
                    Status: ACTIVE
                    Type: EXPENSE
                    TaxType: INPUT
                    Description: Good Bye World
                    Class: EXPENSE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    ReportingCode: EXP
                    ReportingCodeName: Expense
                    UpdatedDateUTC: /Date(1550795389333+0000)/
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - AccountID: 00000000-0000-0000-0000-000000000000
                    Code: "123456"
                    Name: Foobar
                    Type: EXPENSE
                    Description: Hello World
                    ValidationErrors:
                      - Message: Please enter a unique Name.
      requestBody:
        required: true
        description: Request of type Accounts array with one Account
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Accounts'
            example:
              Accounts:
                - Code: "123456"
                  Name: BarFoo
                  AccountID: 99ce6032-0678-4aa0-8148-240c75fee33a
                  Type: EXPENSE
                  Description: GoodBye World
                  TaxType: INPUT
                  EnablePaymentsToAccount: false
                  ShowInExpenseClaims: false
                  Class: EXPENSE
                  ReportingCode: EXP
                  ReportingCodeName: Expense
                  UpdatedDateUTC: "2019-02-21T16:29:47.96-08:00"
    delete:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: deleteAccount
      x-hasAccountingValidationError: true
      summary: Deletes a chart of accounts
      parameters:
        - $ref: '#/components/parameters/AccountID'
      responses:
        "200":
          description: Success - delete existing Account and return response of type Accounts array with deleted Account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Accounts'
              example:
                Id: 76bb0543-8efe-4acc-b7f6-67dfcdec37b4
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550798217216)/
                Accounts:
                  - AccountID: 7f3c0bec-f3e7-4073-b4d6-cc56dd027ef1
                    Code: "123456"
                    Name: FooBar
                    Status: DELETED
                    Type: EXPENSE
                    TaxType: INPUT
                    Description: Hello World
                    Class: EXPENSE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    ReportingCode: EXP
                    ReportingCodeName: Expense
                    UpdatedDateUTC: /Date(1550798217210+0000)/
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - AccountID: 00000000-0000-0000-0000-000000000000
                    Code: "123456"
                    Name: Foobar
                    Type: EXPENSE
                    Description: Hello World
                    ValidationErrors:
                      - Message: Please enter a unique Name.
  /Accounts/{AccountID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getAccountAttachments
      summary: Retrieves attachments for a specific accounts by using a unique account Id
      parameters:
        - $ref: '#/components/parameters/AccountID'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 439c1573-3cd8-4697-a9f6-81fa651ee8f3
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550852630329)/
                Attachments:
                  - AttachmentID: 52a643be-cd5c-489f-9778-53a9fd337756
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Accounts/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /Accounts/{AccountID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getAccountAttachmentById
      summary: Retrieves a specific attachment from a specific account using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/AccountID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Account as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /Accounts/{AccountID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getAccountAttachmentByFileName
      summary: Retrieves an attachment for a specific account by filename
      parameters:
        - $ref: '#/components/parameters/AccountID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Account as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateAccountAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates attachment on a specific account by filename
      parameters:
        - $ref: '#/components/parameters/AccountID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: c8d6413a-1da2-4faa-9848-21f60443e906
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550859714477)/
                Attachments:
                  - AttachmentID: 3fa85f64-5717-4562-b3fc-2c963f66afa6
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Accounts/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createAccountAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment on a specific account
      parameters:
        - $ref: '#/components/parameters/AccountID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 724cdff5-bcd1-4c5c-977e-e864c24258e0
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550856817769)/
                Attachments:
                  - AttachmentID: ab95b276-9dce-4925-9077-439818ba270f
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Accounts/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /BatchPayments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    description: Batch payments allow you to bundle multiple bills or invoices into one payment transaction. This means a single payment in Xero can be reconciled with a single transaction on the bank statement making for a much simpler bank reconciliation experience.
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBatchPayments
      summary: Retrieves either one or many batch payments for invoices
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="AUTHORISED"
          x-example-csharp: Status==\&quot;AUTHORISED\&quot;
          x-example-java: Status==&quot;&apos; + BatchPayment.StatusEnum.AUTHORISED + &apos;&quot;
          x-example-php: Status==&quot;&apos; . XeroAPI\XeroPHP\Models\Accounting\BatchPayment::STATUS_AUTHORISED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::BatchPayment::AUTHORISED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Date ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type BatchPayments array of BatchPayment objects
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchPayments'
              example:
                Id: 6ab84949-4fe5-4788-a135-4d8f690d24d7
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550866184006)/
                BatchPayments:
                  - Account:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      CurrencyCode: NZD
                    Reference: Hello World
                    BatchPaymentID: d0e9bbbf-5b8a-48b6-906a-035591fcb061
                    DateString: 2017-11-28T00:00:00
                    Date: /Date(1511827200000+0000)/
                    Payments:
                      - Invoice:
                          InvoiceID: 0975dec2-0cf6-498d-9c9f-c6775b45c61d
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 97ec2ef8-f4d6-4de5-9f2a-385d41cdc2fc
                        Amount: 200.00
                        BankAmount: 200.00
                      - Invoice:
                          InvoiceID: 600982d9-6605-4e11-afa1-d8dec2be7b52
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: e232795f-b919-4865-a754-12f6ae8402c0
                        Amount: 200.00
                        BankAmount: 200.00
                      - Invoice:
                          InvoiceID: 99a2bd54-4ab1-413c-90bb-57f6464fe5d6
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: c2d571a5-38ff-4d37-9d43-dfadb4ad53ff
                        Amount: 200.00
                        BankAmount: 200.00
                      - Invoice:
                          InvoiceID: c81942c8-bfc5-4c88-a21a-b892a4a8c1c5
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 0f3c18dc-49bd-47a4-a875-03c84a29978f
                        Amount: 200.00
                        BankAmount: 200.00
                      - Invoice:
                          InvoiceID: 6c9a1d89-8319-42f6-87d6-7690e748af85
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 43541eed-f3ac-44ac-88cb-9fe1cb7ed8b8
                        Amount: 200.00
                        BankAmount: 200.00
                    Type: RECBATCH
                    Status: AUTHORISED
                    TotalAmount: 1000.00
                    UpdatedDateUTC: /Date(1511893792820+0000)/
                    IsReconciled: false
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBatchPayment
      summary: Creates one or many batch payments for invoices
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - paymentAccount:
          is_object: true
          key: paymentAccount
          keyPascal: Account
          keySnake: payment_account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: paymentAccount
        - bankAccount:
          is_object: true
          key: bankAccount
          keyPascal: Account
          keySnake: bank_account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: bankAccount
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          keySnake: invoice_id
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - payment:
          is_object: true
          key: payment
          keyPascal: Payment
        - set_bankaccount:
          is_variable: true
          nonString: true
          key: account
          keyPascal: Account
          default: bankAccount
          python: bank_account
          ruby: bank_account
          object: payment
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: payment
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.00
          is_money: true
          object: payment
        - set_invoice:
          is_last: true
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: payment
        - payments:
          is_list: true
          key: payments
          keyPascal: Payment
        - add_payments:
          is_last: true
          is_list_add: true
          key: payments
          keyPascal: Payments
          object: payment
        - batchPayment:
          is_object: true
          key: batchPayment
          keyPascal: BatchPayment
          keySnake: batch_payment
        - set_paymentaccount:
          is_variable: true
          nonString: true
          key: account
          keyPascal: Account
          default: paymentAccount
          python: payment_account
          ruby: payment_account
          object: batchPayment
        - reference:
          key: reference
          keyPascal: Reference
          default: hello foobar
          object: batchPayment
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: batchPayment
        - set_payments:
          is_last: true
          is_variable: true
          nonString: true
          key: payments
          keyPascal: Payments
          default: payments
          object: batchPayment
        - batchPayments:
          is_object: true
          key: batchPayments
          keyPascal: BatchPayments
        - add_batchPayments:
          is_last: true
          is_array_add: true
          key: batchPayments
          keyPascal: BatchPayments
          keySnake: batch_payments
          java: BatchPayments
          python: batch_payment
          ruby: batch_payment
          csharp: BatchPayment
          object: batchPayment
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type BatchPayments array of BatchPayment objects
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchPayments'
              example:
                Id: 424745ed-6356-46ad-87d4-3585f9062fb4
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550865988111)/
                BatchPayments:
                  - Account:
                      AccountID: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                      CurrencyCode: NZD
                    Reference: Foobar123
                    BatchPaymentID: d318c343-208e-49fe-b04a-45642349bcf1
                    DateString: 2019-02-22T00:00:00
                    Date: /Date(1550793600000+0000)/
                    Payments:
                      - Invoice:
                          InvoiceID: 3323652c-155e-433b-8a73-4dde7cfbf410
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: c05098fa-ae3c-4f00-80ec-0a9df07dedff
                        Amount: 1.00
                        BankAmount: 1.00
                      - Invoice:
                          InvoiceID: e4abafb4-1f5b-4d9f-80b3-9a7b815bc302
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 96409489-2f7d-4804-9a6d-6b939b0e038a
                        Amount: 1.00
                        BankAmount: 1.00
                      - Invoice:
                          InvoiceID: e6039672-b161-40cd-b07b-a0178e7186ad
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: d2796067-bf71-4f06-b386-81f1454fa866
                        Amount: 1.00
                        BankAmount: 1.00
                    Type: RECBATCH
                    Status: AUTHORISED
                    TotalAmount: 3.00
                    UpdatedDateUTC: /Date(1550865987783+0000)/
                    IsReconciled: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: BatchPayments with an array of Payments in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchPayments'
            example:
              BatchPayments:
                - Account:
                    AccountID: 00000000-0000-0000-0000-000000000000
                  Reference: ref
                  Date: "2018-08-01"
                  Payments:
                    - Account:
                        Code: "001"
                      Date: "2019-12-31"
                      Amount: 500
                      Invoice:
                        InvoiceID: 00000000-0000-0000-0000-000000000000
                        LineItems: []
                        Contact: {}
                        Type: ACCPAY
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deleteBatchPayment
      summary: Updates a specific batch payment for invoices and credit notes
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - batchPaymentDelete:
          is_object: true
          key: batchPaymentDelete
          keyPascal: BatchPaymentDelete
        - status:
          is_last: true
          key: status
          keyPascal: Status
          default: DELETED
          object: batchPaymentDelete
        - batchPaymentID:
          is_last: true
          is_uuid: true
          key: batchPaymentID
          keyPascal: BatchPaymentID
          keySnake: batch_payment_id
          default: 00000000-0000-0000-0000-000000000000
          object: batchPaymentDelete
      responses:
        "200":
          description: Success - return response of type BatchPayments array for updated BatchPayment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchPayments'
              example:
                Id: ee23328c-4a8b-4ee7-8fb6-9796ffab9cb0
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1583945852489)/
                BatchPayments:
                  - Account:
                      AccountID: efb6e3a4-3156-4cee-bfe1-a282a3cc1d8f
                      CurrencyCode: NZD
                    BatchPaymentID: b649632e-2782-4c74-95a5-d994d7140ed9
                    DateString: 2022-08-01T00:00:00
                    Date: /Date(1659312000000+0000)/
                    Payments: []
                    Type: PAYBATCH
                    Status: DELETED
                    TotalAmount: 18.00
                    UpdatedDateUTC: /Date(1659377631813+0000)/
                    IsReconciled: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchPaymentDelete'
            example:
              BatchPaymentID: 9bf296e9-0748-4d29-a3dc-24dde1098030
              Status: DELETED
  /BatchPayments/{BatchPaymentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBatchPayment
      summary: Retrieves a specific batch payment using a unique batch payment Id
      parameters:
        - $ref: '#/components/parameters/BatchPaymentID'
      responses:
        "200":
          description: Success - return response of type BatchPayments array with matching batch payment Id
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchPayments'
              example:
                Id: 6ab84949-4fe5-4788-a135-4d8f690d24d7
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550866184006)/
                BatchPayments:
                  - Account:
                      AccountID: 13918178-849a-4823-9a31-57b7eac713d7
                      CurrencyCode: NZD
                    Reference: ref
                    BatchPaymentID: 44a1013e-4946-4a73-b207-dfe5424a5ea5
                    DateString: 2018-10-03T00:00:00
                    Date: /Date(1538524800000+0000)/
                    Payments:
                      - Invoice:
                          InvoiceID: 5aa9451d-95d1-4f95-a966-bbab2573f71c
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: a22a64cb-364e-43fa-9a1f-bb2cd1f4adde
                        Reference: ref/cheque
                        Amount: 913.55
                        BankAmount: 913.55
                      - Invoice:
                          InvoiceID: 30a87092-31b5-4a2c-831e-327486533dd2
                          CurrencyCode: AUD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 6e20be79-32d8-4ae1-978e-f76d9b245c02
                        Amount: 495
                        BankAmount: 540
                      - Invoice:
                          InvoiceID: 86d6e00f-ef56-49f7-9a54-796ccd5ca057
                          CurrencyCode: NZD
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                        PaymentID: 4ba761b8-5940-4a3f-bcdf-7775adb00332
                        Amount: 3080
                        BankAmount: 3080
                    Type: RECBATCH
                    Status: AUTHORISED
                    TotalAmount: 4533.55
                    UpdatedDateUTC: /Date(1538525239370+0000)/
                    IsReconciled: false
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deleteBatchPaymentByUrlParam
      summary: Updates a specific batch payment for invoices and credit notes
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BatchPaymentID'
      responses:
        "200":
          description: Success - return response of type BatchPayments array for updated BatchPayment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchPayments'
              example:
                Id: ee23328c-4a8b-4ee7-8fb6-9796ffab9cb0
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1583945852489)/
                BatchPayments:
                  - Account:
                      AccountID: efb6e3a4-3156-4cee-bfe1-a282a3cc1d8f
                      CurrencyCode: NZD
                    BatchPaymentID: b649632e-2782-4c74-95a5-d994d7140ed9
                    DateString: 2022-08-01T00:00:00
                    Date: /Date(1659312000000+0000)/
                    Payments: []
                    Type: PAYBATCH
                    Status: DELETED
                    TotalAmount: 18.00
                    UpdatedDateUTC: /Date(1659377631813+0000)/
                    IsReconciled: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchPaymentDeleteByUrlParam'
            example:
              Status: DELETED
  /BatchPayments/{BatchPaymentID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBatchPaymentHistory
      summary: Retrieves history from a specific batch payment
      parameters:
        - $ref: '#/components/parameters/BatchPaymentID'
      responses:
        "200":
          description: Success - return response of HistoryRecords array of 0 to N HistoryRecord
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryRecords'
              example:
                Id: c58e2f9c-baad-42a4-8bb7-f32b6f88fa04
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550898452503)/
                HistoryRecords:
                  - Changes: Approved
                    DateUTCString: 2017-11-28T18:29:52
                    DateUTC: /Date(1511893792813+0000)/
                    User: Buzz Lightyear
                    Details: ""
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBatchPaymentHistoryRecord
      summary: Creates a history record for a specific batch payment
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BatchPaymentID'
      responses:
        "200":
          description: Success - return response of type HistoryRecords array of HistoryRecord objects
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryRecords'
              example:
                Id: d7525479-3392-44c0-bb37-ff4a0b5df5bd
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550899400362)/
                HistoryRecords:
                  - DateUTCString: 2019-02-23T05:23:20
                    DateUTC: /Date(1550899400362)/
                    Details: Hello World
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /BankTransactions:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransactions
      summary: Retrieves any spent or received money transactions
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="AUTHORISED"
          x-example-java: Status==&quot;&apos; + BankTransaction.StatusEnum.AUTHORISED + &apos;&quot;
          x-example-csharp: Status==\"AUTHORISED\"
          x-example-php: Status==&quot;&apos; . XeroAPI\XeroPHP\Models\Accounting\BankTransaction::STATUS_AUTHORISED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::BankTransaction::AUTHORISED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Type ASC
          schema:
            type: string
        - in: query
          name: page
          description: Up to 100 bank transactions will be returned in a single API call with line items details
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type BankTransactions array with 0 to n BankTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransactions'
              example:
                Id: 18e7e80c-5dca-4a57-974e-8b572cc5efe8
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551212901659)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 3
                BankTransactions:
                  - BankTransactionID: db54aab0-ad40-4ced-bcff-0940ba20db2c
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    BatchPayment:
                      Account:
                        AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                      Date: /Date(1476316800000+0000)/
                      Type: RECBATCH
                      Status: AUTHORISED
                      TotalAmount: "12.00"
                      UpdatedDateUTC: /Date(1476392487037+0000)/
                      IsReconciled: "false"
                    Type: RECEIVE
                    IsReconciled: false
                    PrepaymentID: cb62750f-b49c-464b-a45b-e2e2c514c8a9
                    HasAttachments: true
                    Contact:
                      ContactID: 9c2c64de-12c9-4167-b503-e2c0e1aa1f49
                      Name: sam
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2016-10-13T00:00:00
                    Date: /Date(1476316800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 10
                    TotalTax: 0
                    Total: 10
                    UpdatedDateUTC: /Date(1476389616437+0000)/
                    CurrencyCode: USD
                  - BankTransactionID: 29a69c45-64ca-4805-a1cc-34990de837b3
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Type: SPEND-OVERPAYMENT
                    IsReconciled: false
                    OverpaymentID: 7d457db3-3b0a-47e9-8b79-81252a7bcdcb
                    HasAttachments: false
                    Contact:
                      ContactID: 9c2c64de-12c9-4167-b503-e2c0e1aa1f49
                      Name: sam
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2016-10-13T00:00:00
                    Date: /Date(1476316800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 9
                    TotalTax: 0
                    Total: 9
                    UpdatedDateUTC: /Date(1476389930500+0000)/
                    CurrencyCode: USD
                  - BankTransactionID: 0b89bf5c-d40b-4514-96be-36a739fb0188
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Type: SPEND-OVERPAYMENT
                    IsReconciled: false
                    OverpaymentID: bf9b5f33-c0d6-4182-84a2-40848023e5a1
                    HasAttachments: false
                    Contact:
                      ContactID: 9c2c64de-12c9-4167-b503-e2c0e1aa1f49
                      Name: sam
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2016-10-13T00:00:00
                    Date: /Date(1476316800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 8
                    TotalTax: 0
                    Total: 8
                    UpdatedDateUTC: /Date(1476392487037+0000)/
                    CurrencyCode: USD
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBankTransactions
      summary: Creates one or more spent or received money transaction
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_uuid: true
          is_last: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - bankAccount:
          is_object: true
          key: bankAccount
          keyPascal: Account
          keySnake: bank_account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: bankAccount
        - bankTransaction:
          is_object: true
          key: bankTransaction
          keyPascal: BankTransaction
          keySnake: bank_transaction
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: RECEIVE
          php: XeroAPI\XeroPHP\Models\Accounting\BankTransaction::TYPE_RECEIVE
          node: BankTransaction.TypeEnum.RECEIVE
          ruby: XeroRuby::Accounting::BankTransaction::RECEIVE
          python_string: RECEIVE
          java: com.xero.models.accounting.BankTransaction.TypeEnum.RECEIVE
          csharp: BankTransaction.TypeEnum.RECEIVE
          object: bankTransaction
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: bankTransaction
        - set_lineitems:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          object: bankTransaction
          default: lineItems
        - set_bankaccount:
          is_last: true
          is_variable: true
          nonString: true
          key: bankAccount
          keyPascal: BankAccount
          keySnake: bank_account
          python: bank_account
          ruby: bank_account
          default: bankAccount
          object: bankTransaction
        - bankTransactions:
          is_object: true
          key: bankTransactions
          keyPascal: BankTransactions
        - add_bankTransaction:
          is_last: true
          is_array_add: true
          key: bankTransactions
          keyPascal: BankTransactions
          keySnake: bank_transactions
          java: BankTransactions
          python: bank_transaction
          ruby: bank_transaction
          csharp: BankTransaction
          object: bankTransaction
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type BankTransactions array with new BankTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransactions'
              example:
                Id: 5bc1d776-3c7f-4fe8-9b2d-09e747077a88
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551213568047)/
                BankTransactions:
                  - BankTransactionID: 1289c190-e46d-434b-9628-463ffdb52f00
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Type: SPEND
                    Reference: ""
                    IsReconciled: false
                    CurrencyRate: 1.000000
                    Contact:
                      ContactID: 5cc8cf28-567e-4d43-b287-687cfcaec47c
                      ContactStatus: ACTIVE
                      Name: Katherine Warren
                      FirstName: Katherine
                      LastName: Warren
                      EmailAddress: kat.warren@clampett.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          AddressLine1: ""
                          AddressLine2: ""
                          AddressLine3: ""
                          AddressLine4: ""
                          City: Palo Alto
                          Region: CA
                          PostalCode: "94020"
                          Country: United States
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 847-1294
                          PhoneAreaCode: (626)
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1503348544227+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-02-26T00:00:00
                    Date: /Date(1551139200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Inclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: TAX001
                        TaxAmount: 1.74
                        LineAmount: 20.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: d2a06879-da49-4d6c-83b5-72a93a523ec6
                        AccountID: ebd06280-af70-4bed-97c6-7451a454ad85
                        ValidationErrors: []
                    SubTotal: 18.26
                    TotalTax: 1.74
                    Total: 20.00
                    UpdatedDateUTC: /Date(1551213567813+0000)/
                    CurrencyCode: USD
                    StatusAttributeString: ERROR
                    ValidationErrors:
                      - Message: 'The Contact must contain at least 1 of the following elements to identify the contact: Name, ContactID, ContactNumber'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: BankTransactions with an array of BankTransaction objects in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BankTransactions'
            example:
              bankTransactions:
                - type: BankTransaction.TypeEnum.SPEND
                  contact:
                    contactID: 00000000-0000-0000-0000-000000000000
                  lineItems:
                    - description: Foobar
                      quantity: 1.0
                      unitAmount: 20.0
                      accountCode: "000"
                  bankAccount:
                    code: "000"
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateBankTransactions
      summary: Updates or creates one or more spent or received money transaction
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_uuid: true
          is_last: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - bankAccount:
          is_object: true
          key: bankAccount
          keyPascal: Account
          keySnake: bank_account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: bankAccount
        - bankTransaction:
          is_object: true
          key: bankTransaction
          keyPascal: BankTransaction
          keySnake: bank_transaction
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: RECEIVE
          php: XeroAPI\XeroPHP\Models\Accounting\BankTransaction::TYPE_RECEIVE
          node: BankTransaction.TypeEnum.RECEIVE
          ruby: XeroRuby::Accounting::BankTransaction::RECEIVE
          python_string: RECEIVE
          java: com.xero.models.accounting.BankTransaction.TypeEnum.RECEIVE
          csharp: BankTransaction.TypeEnum.RECEIVE
          object: bankTransaction
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: bankTransaction
        - set_lineitems:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          object: bankTransaction
          default: lineItems
        - set_bankaccount:
          is_last: true
          is_variable: true
          nonString: true
          key: bankAccount
          keyPascal: BankAccount
          keySnake: bank_account
          python: bank_account
          ruby: bank_account
          default: bankAccount
          object: bankTransaction
        - bankTransactions:
          is_object: true
          key: bankTransactions
          keyPascal: BankTransactions
        - add_bankTransaction:
          is_last: true
          is_array_add: true
          key: bankTransactions
          keyPascal: BankTransactions
          keySnake: bank_transactions
          java: BankTransactions
          python: bank_transaction
          ruby: bank_transaction
          csharp: BankTransaction
          object: bankTransaction
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type BankTransactions array with new BankTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransactions'
              example:
                Id: 5bc1d776-3c7f-4fe8-9b2d-09e747077a88
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551213568047)/
                BankTransactions:
                  - BankTransactionID: 1289c190-e46d-434b-9628-463ffdb52f00
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Type: SPEND
                    Reference: ""
                    IsReconciled: false
                    CurrencyRate: 1.000000
                    Contact:
                      ContactID: 5cc8cf28-567e-4d43-b287-687cfcaec47c
                      ContactStatus: ACTIVE
                      Name: Katherine Warren
                      FirstName: Katherine
                      LastName: Warren
                      EmailAddress: kat.warren@clampett.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          AddressLine1: ""
                          AddressLine2: ""
                          AddressLine3: ""
                          AddressLine4: ""
                          City: Palo Alto
                          Region: CA
                          PostalCode: "94020"
                          Country: United States
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 847-1294
                          PhoneAreaCode: (626)
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1503348544227+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-02-26T00:00:00
                    Date: /Date(1551139200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Inclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: TAX001
                        TaxAmount: 1.74
                        LineAmount: 20.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: d2a06879-da49-4d6c-83b5-72a93a523ec6
                        AccountID: ebd06280-af70-4bed-97c6-7451a454ad85
                        ValidationErrors: []
                    SubTotal: 18.26
                    TotalTax: 1.74
                    Total: 20.00
                    UpdatedDateUTC: /Date(1551213567813+0000)/
                    CurrencyCode: USD
                    StatusAttributeString: ERROR
                    ValidationErrors:
                      - Message: 'The Contact must contain at least 1 of the following elements to identify the contact: Name, ContactID, ContactNumber'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BankTransactions'
            example:
              BankTransactions:
                - Type: SPEND
                  Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  Lineitems:
                    - Description: Foobar
                      Quantity: 1
                      UnitAmount: 20
                      AccountCode: "400"
                  BankAccount:
                    Code: "088"
  /BankTransactions/{BankTransactionID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransaction
      summary: Retrieves a single spent or received money transaction by using a unique bank transaction Id
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type BankTransactions array with a specific BankTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransactions'
              example:
                Id: 612e204d-21ab-469b-ac84-afe0697b4461
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551212902962)/
                BankTransactions:
                  - BankTransactionID: db54aab0-ad40-4ced-bcff-0940ba20db2c
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    BatchPayment:
                      Account:
                        AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                      Date: /Date(1476316800000+0000)/
                      Type: RECBATCH
                      Status: AUTHORISED
                      TotalAmount: "12.00"
                      UpdatedDateUTC: /Date(1476392487037+0000)/
                      IsReconciled: "false"
                    Type: RECEIVE
                    IsReconciled: false
                    CurrencyRate: 1.000000
                    PrepaymentID: cb62750f-b49c-464b-a45b-e2e2c514c8a9
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 45dd3143-9856-42d2-9a6c-53814f67a33e
                        FileName: sample2.jpg
                        Url: https://api.xero.com/api.xro/2.0/banktransaction/db54aab0-ad40-4ced-bcff-0940ba20db2c/Attachments/sample2.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                    Contact:
                      ContactID: 9c2c64de-12c9-4167-b503-e2c0e1aa1f49
                      ContactStatus: ACTIVE
                      Name: sam
                      EmailAddress: ""
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1518821703467+0000)/
                      ContactGroups: []
                      DefaultCurrency: USD
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2016-10-13T00:00:00
                    Date: /Date(1476316800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: hello
                        UnitAmount: 10.00
                        TaxType: OUTPUT
                        TaxAmount: 0.00
                        LineAmount: 10.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 40bec527-a744-4149-96c5-0ab643b51158
                        AccountID: ebd06280-af70-4bed-97c6-7451a454ad85
                        ValidationErrors: []
                    SubTotal: 10.00
                    TotalTax: 0.00
                    Total: 10.00
                    UpdatedDateUTC: /Date(1476389616437+0000)/
                    CurrencyCode: USD
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateBankTransaction
      summary: Updates a single spent or received money transaction
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_uuid: true
          is_last: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - bankAccount:
          is_object: true
          key: bankAccount
          keyPascal: Account
          keySnake: bank_account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: bankAccount
        - bankTransaction:
          is_object: true
          key: bankTransaction
          keyPascal: BankTransaction
          keySnake: bank_transaction
        - reference:
          key: reference
          keyPascal: Reference
          default: You just updated
          object: bankTransaction
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: RECEIVE
          php: XeroAPI\XeroPHP\Models\Accounting\BankTransaction::TYPE_RECEIVE
          node: BankTransaction.TypeEnum.RECEIVE
          ruby: XeroRuby::Accounting::BankTransaction::RECEIVE
          python_string: RECEIVE
          java: com.xero.models.accounting.BankTransaction.TypeEnum.RECEIVE
          csharp: BankTransaction.TypeEnum.RECEIVE
          object: bankTransaction
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: bankTransaction
        - set_lineitems:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          object: bankTransaction
          default: lineItems
        - set_bankaccount:
          is_last: true
          is_variable: true
          nonString: true
          key: bankAccount
          keyPascal: BankAccount
          keySnake: bank_account
          python: bank_account
          ruby: bank_account
          default: bankAccount
          object: bankTransaction
        - bankTransactions:
          is_object: true
          key: bankTransactions
          keyPascal: BankTransactions
        - add_bankTransaction:
          is_last: true
          is_array_add: true
          key: bankTransactions
          keyPascal: BankTransactions
          keySnake: bank_transactions
          java: BankTransactions
          python: bank_transaction
          ruby: bank_transaction
          csharp: BankTransaction
          object: bankTransaction
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type BankTransactions array with updated BankTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransactions'
              example:
                Id: f2c7f037-96fc-49bd-8f59-d3c7bfdd4746
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551213568875)/
                BankTransactions:
                  - BankTransactionID: 1289c190-e46d-434b-9628-463ffdb52f00
                    BankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Type: SPEND
                    Reference: You just updated
                    IsReconciled: false
                    CurrencyRate: 1.000000
                    HasAttachments: false
                    Attachments: []
                    Contact:
                      ContactID: 5cc8cf28-567e-4d43-b287-687cfcaec47c
                      ContactStatus: ACTIVE
                      Name: Katherine Warren
                      FirstName: Katherine
                      LastName: Warren
                      EmailAddress: kat.warren@clampett.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          AddressLine1: ""
                          AddressLine2: ""
                          AddressLine3: ""
                          AddressLine4: ""
                          City: Palo Alto
                          Region: CA
                          PostalCode: "94020"
                          Country: United States
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 847-1294
                          PhoneAreaCode: (626)
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1503348544227+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-02-25T00:00:00
                    Date: /Date(1551052800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Inclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: TAX001
                        TaxAmount: 1.74
                        LineAmount: 20.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: d2a06879-da49-4d6c-83b5-72a93a523ec6
                        AccountID: ebd06280-af70-4bed-97c6-7451a454ad85
                        ValidationErrors: []
                    SubTotal: 18.26
                    TotalTax: 1.74
                    Total: 20.00
                    UpdatedDateUTC: /Date(1551213568733+0000)/
                    CurrencyCode: USD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BankTransactions'
            example:
              BankTransactions:
                - Type: SPEND
                  Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                    ContactStatus: ACTIVE
                    Name: Buzz Lightyear
                    FirstName: Buzz
                    LastName: Lightyear
                    EmailAddress: buzz.Lightyear@email.com
                    ContactPersons: []
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        AddressLine1: ""
                        AddressLine2: ""
                        AddressLine3: ""
                        AddressLine4: ""
                        City: Palo Alto
                        Region: CA
                        PostalCode: "94020"
                        Country: United States
                    Phones:
                      - PhoneType: DEFAULT
                        PhoneNumber: 847-1294
                        PhoneAreaCode: (626)
                        PhoneCountryCode: ""
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                    UpdatedDateUTC: "2017-08-21T13:49:04.227-07:00"
                    ContactGroups: []
                  Lineitems: []
                  BankAccount:
                    Code: "088"
                    Name: Business Wells Fargo
                    AccountID: 00000000-0000-0000-0000-000000000000
                  IsReconciled: false
                  Date: "2019-02-25"
                  Reference: You just updated
                  CurrencyCode: USD
                  CurrencyRate: 1
                  Status: AUTHORISED
                  LineAmountTypes: Inclusive
                  TotalTax: 1.74
                  BankTransactionID: 00000000-0000-0000-0000-000000000000
                  UpdatedDateUTC: "2019-02-26T12:39:27.813-08:00"
  /BankTransactions/{BankTransactionID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransactionAttachments
      summary: Retrieves any attachments from a specific bank transactions
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
      responses:
        "200":
          description: Success - return response of type Attachments array with 0 to n Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: c50798e1-29e9-4a30-a452-bb6e42e400c8
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551303999577)/
                Attachments:
                  - AttachmentID: 4508a692-e52c-4ad8-a138-2f13e22bf57b
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransactions/db54aab0-ad40-4ced-bcff-0940ba20db2c/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
                  - AttachmentID: 45dd3143-9856-42d2-9a6c-53814f67a33e
                    FileName: sample2.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransactions/db54aab0-ad40-4ced-bcff-0940ba20db2c/Attachments/sample2.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /BankTransactions/{BankTransactionID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransactionAttachmentById
      summary: Retrieves specific attachments from a specific BankTransaction using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for BankTransaction as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /BankTransactions/{BankTransactionID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransactionAttachmentByFileName
      summary: Retrieves a specific attachment from a specific bank transaction by filename
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for BankTransaction as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateBankTransactionAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment from a specific bank transaction by filename
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 572ad2fe-8c23-45aa-82f9-864485327685
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551286166630)/
                Attachments:
                  - AttachmentID: 4508a692-e52c-4ad8-a138-2f13e22bf57b
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransactions/db54aab0-ad40-4ced-bcff-0940ba20db2c/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createBankTransactionAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment for a specific bank transaction by filename
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransactionID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 572ad2fe-8c23-45aa-82f9-864485327685
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551286166630)/
                Attachments:
                  - AttachmentID: 4508a692-e52c-4ad8-a138-2f13e22bf57b
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransactions/db54aab0-ad40-4ced-bcff-0940ba20db2c/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /BankTransactions/{BankTransactionID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransactionsHistory
      summary: Retrieves history from a specific bank transaction using a unique bank transaction Id
      parameters:
        - $ref: '#/components/parameters/BankTransactionID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBankTransactionHistoryRecord
      summary: Creates a history record for a specific bank transactions
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransactionID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /BankTransfers:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransfers
      summary: Retrieves all bank transfers
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: HasAttachments==true
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Amount ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of BankTransfers array of 0 to N BankTransfer
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransfers'
              example:
                Id: dfc0d130-9007-4a98-a5ef-6f01700f18e2
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551311318988)/
                BankTransfers:
                  - BankTransferID: 6221458a-ef7a-4d5f-9b1c-1b96ce03833c
                    CreatedDateUTCString: 2016-10-17T20:46:01
                    CreatedDateUTC: /Date(1476737161140+0000)/
                    DateString: 2016-11-12T21:10:00
                    Date: /Date(1478985000000+0000)/
                    FromBankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Name: Business Wells Fargo
                    ToBankAccount:
                      AccountID: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                      Name: My Savings
                    Amount: 20.00
                    FromBankTransactionID: a3eca480-bc04-4292-9bbd-5c57b8ba12b4
                    ToBankTransactionID: 4ca13f40-f3a0-4530-a442-a600f5696118
                    FromIsReconciled: true
                    ToIsReconciled: true
                    Reference: Sub 098801
                    HasAttachments: true
                  - BankTransferID: 9f0153d5-617c-4903-887b-3875807aa27a
                    CreatedDateUTCString: 2016-10-21T23:28:42
                    CreatedDateUTC: /Date(1477092522333+0000)/
                    DateString: 2016-10-19T20:10:00
                    Date: /Date(1476907800000+0000)/
                    FromBankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Name: Business Wells Fargo
                    ToBankAccount:
                      AccountID: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                      Name: My Savings
                    Amount: 20.00
                    FromBankTransactionID: cb74287e-5682-4973-b354-93e2c7a836d3
                    ToBankTransactionID: 4c48ba6c-f318-4405-aee6-b5efa2c70f55
                    FromIsReconciled: false
                    ToIsReconciled: false
                    Reference: Sub 098801
                    HasAttachments: false
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBankTransfer
      summary: Creates a bank transfer
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - fromBankAccount:
          is_object: true
          key: fromBankAccount
          keyPascal: Account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: fromBankAccount
        - toBankAccount:
          is_object: true
          key: toBankAccount
          keyPascal: Account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: toBankAccount
        - bankTransfer:
          is_object: true
          key: bankTransfer
          keyPascal: BankTransfer
          keySnake: bank_transfer
        - set_fromBankAccount:
          is_variable: true
          nonString: true
          key: fromBankAccount
          keyPascal: FromBankAccount
          keySnake: from_bank_account
          default: fromBankAccount
          object: bankTransfer
        - set_toBankAccount:
          is_variable: true
          nonString: true
          key: toBankAccount
          keyPascal: ToBankAccount
          keySnake: to_bank_account
          default: toBankAccount
          object: bankTransfer
        - amount:
          is_last: true
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          object: bankTransfer
        - bankTransfers:
          is_object: true
          key: bankTransfers
          keyPascal: BankTransfers
        - add_bankTransfer:
          is_last: true
          is_array_add: true
          key: bankTransfers
          keyPascal: BankTransfers
          keySnake: bank_transfers
          java: BankTransfers
          python: bank_transfer
          ruby: bank_transfer
          csharp: BankTransfer
          object: bankTransfer
      responses:
        "200":
          description: Success - return response of BankTransfers array of one BankTransfer
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransfers'
              example:
                Id: ae767b68-affd-4e17-bac0-83eaf1854dcd
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551311317475)/
                BankTransfers:
                  - BankTransferID: 76eea4b6-f026-464c-b6f3-5fb39a196145
                    DateString: 2019-02-27T00:00:00
                    Date: /Date(1551225600000+0000)/
                    FromBankAccount:
                      AccountID: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                      Code: "090"
                      Name: My Savings
                    ToBankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    Amount: 50.00
                    FromBankTransactionID: e4059952-5acb-4a56-b076-53fad85f2930
                    ToBankTransactionID: 88e4ac17-293b-4e5a-8d8b-3ce3a0b1ee17
                    FromIsReconciled: true
                    ToIsReconciled: true
                    Reference: Sub 098801
                    CurrencyRate: 1.000000
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: BankTransfers with array of BankTransfer objects in request body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BankTransfers'
            example:
              BankTransfers:
                - FromBankAccount:
                    Code: "090"
                    Name: My Savings
                    AccountID: 00000000-0000-0000-0000-000000000000
                    Type: BANK
                    BankAccountNumber: "123455"
                    Status: ACTIVE
                    BankAccountType: BANK
                    CurrencyCode: USD
                    TaxType: NONE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    Class: ASSET
                    ReportingCode: ASS
                    ReportingCodeName: Assets
                    HasAttachments: false
                    UpdatedDateUTC: "2016-10-17T13:45:33.993-07:00"
                  ToBankAccount:
                    Code: "088"
                    Name: Business Wells Fargo
                    AccountID: 00000000-0000-0000-0000-000000000000
                    Type: BANK
                    BankAccountNumber: "123455"
                    Status: ACTIVE
                    BankAccountType: BANK
                    CurrencyCode: USD
                    TaxType: NONE
                    EnablePaymentsToAccount: false
                    ShowInExpenseClaims: false
                    Class: ASSET
                    ReportingCode: ASS
                    ReportingCodeName: Assets
                    HasAttachments: false
                    UpdatedDateUTC: "2016-06-03T08:31:14.517-07:00"
                  Amount: "50.00"
                  FromIsReconciled: true
                  ToIsReconciled: true
                  Reference: Sub 098801
  /BankTransfers/{BankTransferID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransfer
      summary: Retrieves specific bank transfers by using a unique bank transfer Id
      parameters:
        - $ref: '#/components/parameters/BankTransferID'
      responses:
        "200":
          description: Success - return response of BankTransfers array with one BankTransfer
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BankTransfers'
              example:
                Id: 1a5fa46d-5ece-4ef2-89b1-77c293b5d833
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551311320368)/
                BankTransfers:
                  - BankTransferID: 6221458a-ef7a-4d5f-9b1c-1b96ce03833c
                    CreatedDateUTCString: 2016-10-17T20:46:01
                    CreatedDateUTC: /Date(1476737161140+0000)/
                    DateString: 2016-11-12T21:10:00
                    Date: /Date(1478985000000+0000)/
                    FromBankAccount:
                      AccountID: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                      Code: "088"
                      Name: Business Wells Fargo
                    ToBankAccount:
                      AccountID: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                      Code: "090"
                      Name: My Savings
                    Amount: 20.00
                    FromBankTransactionID: a3eca480-bc04-4292-9bbd-5c57b8ba12b4
                    ToBankTransactionID: 4ca13f40-f3a0-4530-a442-a600f5696118
                    FromIsReconciled: false
                    ToIsReconciled: false
                    Reference: Sub 098801
                    CurrencyRate: 1.000000
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: e05a6fd8-0e47-47a9-9799-b809c8267260
                        FileName: HelloWorld.jpg
                        Url: https://api.xero.com/api.xro/2.0/banktransfer/6221458a-ef7a-4d5f-9b1c-1b96ce03833c/Attachments/HelloWorld.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
  /BankTransfers/{BankTransferID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransferAttachments
      summary: Retrieves attachments from a specific bank transfer
      parameters:
        - $ref: '#/components/parameters/BankTransferID'
      responses:
        "200":
          description: Success - return response of Attachments array of 0 to N Attachment for a Bank Transfer
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 5cb6b587-7b02-46b6-97fe-d8ad8f20321b
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551397557272)/
                Attachments:
                  - AttachmentID: e05a6fd8-0e47-47a9-9799-b809c8267260
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransfers/6221458a-ef7a-4d5f-9b1c-1b96ce03833c/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /BankTransfers/{BankTransferID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransferAttachmentById
      summary: Retrieves a specific attachment from a specific bank transfer using a unique attachment ID
      parameters:
        - $ref: '#/components/parameters/BankTransferID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of binary data from the Attachment to a Bank Transfer
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /BankTransfers/{BankTransferID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getBankTransferAttachmentByFileName
      summary: Retrieves a specific attachment on a specific bank transfer by file name
      parameters:
        - $ref: '#/components/parameters/BankTransferID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of binary data from the Attachment to a Bank Transfer
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateBankTransferAttachmentByFileName
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransferID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of Attachments array of 0 to N Attachment for a Bank Transfer
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: c7810140-19c2-4ff7-b3ec-b7e95ce7becf
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551398138226)/
                Attachments:
                  - AttachmentID: 0851935c-c4c5-4de8-9247-ce22efde6f82
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransfers/6221458a-ef7a-4d5f-9b1c-1b96ce03833c/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createBankTransferAttachmentByFileName
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransferID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of Attachments array of 0 to N Attachment for a Bank Transfer
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: b73ba149-76a9-4e7c-a5c6-b9230022f416
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551397998372)/
                Attachments:
                  - AttachmentID: 9478be4c-c707-48c1-b4a7-83d8eaf442b5
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/BankTransfers/6221458a-ef7a-4d5f-9b1c-1b96ce03833c/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /BankTransfers/{BankTransferID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getBankTransferHistory
      summary: Retrieves history from a specific bank transfer using a unique bank transfer Id
      parameters:
        - $ref: '#/components/parameters/BankTransferID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createBankTransferHistoryRecord
      summary: Creates a history record for a specific bank transfer
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BankTransferID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /BrandingThemes:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getBrandingThemes
      summary: Retrieves all the branding themes
      responses:
        "200":
          description: Success - return response of type BrandingThemes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BrandingThemes'
              example:
                Id: d1a1beea-bdfe-4ee4-9dbc-27226a26cd68
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550881711906)/
                BrandingThemes:
                  - BrandingThemeID: dabc7637-62c1-4941-8a6e-ee44fa5090e7
                    Name: Standard
                    SortOrder: 0
                    CreatedDateUTC: /Date(1464967643813+0000)/
  /BrandingThemes/{BrandingThemeID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getBrandingTheme
      summary: Retrieves a specific branding theme using a unique branding theme Id
      parameters:
        - $ref: '#/components/parameters/BrandingThemeID'
      responses:
        "200":
          description: Success - return response of type BrandingThemes with one BrandingTheme
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BrandingThemes'
              example:
                Id: df671650-cf14-4a7f-b609-4166933719bc
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550881713071)/
                BrandingThemes:
                  - BrandingThemeID: dabc7637-62c1-4941-8a6e-ee44fa5090e7
                    Name: Standard
                    SortOrder: 0
                    CreatedDateUTC: /Date(1464967643813+0000)/
  /BrandingThemes/{BrandingThemeID}/PaymentServices:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - paymentservices
      tags:
        - Accounting
      operationId: getBrandingThemePaymentServices
      summary: Retrieves the payment services for a specific branding theme
      x-excludeFromPreview: true
      parameters:
        - $ref: '#/components/parameters/BrandingThemeID'
      responses:
        "200":
          description: Success - return response of type PaymentServices array with 0 to N PaymentService
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentServices'
              example:
                Id: bfd5adbe-0e92-48f0-8c5a-39072f6c4ed3
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551139339419)/
                PaymentServices:
                  - PaymentServiceID: 8cc53aa4-ae01-45b9-b06c-69c42eeae61f
                    PaymentServiceName: Buzz Lightyear
                    PaymentServiceType: PayPal
                  - PaymentServiceID: dede7858-14e3-4a46-bf95-4d4cc491e645
                    PaymentServiceName: ACME Payment
                    PaymentServiceUrl: https://www.payupnow.com/
                    PaymentServiceType: Custom
                    PayNowText: Pay Now
    post:
      security:
        - OAuth2:
            - paymentservices
      tags:
        - Accounting
      operationId: createBrandingThemePaymentServices
      summary: Creates a new custom payment service for a specific branding theme
      x-excludeFromPreview: true
      x-hasAccountingValidationError: true
      x-example:
        - object:
          is_object: true
          key: paymentService
          keyPascal: PaymentService
          keySnake: payment_service
        - paymentServiceID:
          is_uuid: true
          key: paymentServiceID
          keyPascal: PaymentServiceID
          keySnake: payment_service_id
          default: 00000000-0000-0000-0000-000000000000
          object: paymentService
        - paymentServiceName:
          key: paymentServiceName
          keyPascal: PaymentServiceName
          keySnake: payment_service_name
          default: ACME Payments
          object: paymentService
        - paymentServiceUrl:
          key: paymentServiceUrl
          keyPascal: PaymentServiceUrl
          keySnake: payment_service_url
          default: https://www.payupnow.com/
          object: paymentService
        - payNowText:
          is_last: true
          key: payNowText
          keyPascal: PayNowText
          keySnake: pay_now_text
          default: Pay Now
          object: paymentService
        - paymentServices:
          is_object: true
          key: paymentServices
          keyPascal: PaymentServices
        - add_paymentService:
          is_last: true
          is_array_add: true
          key: paymentServices
          keyPascal: PaymentServices
          java: PaymentServices
          csharp: PaymentService
          object: paymentService
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/BrandingThemeID'
      responses:
        "200":
          description: Success - return response of type PaymentServices array with newly created PaymentService
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentServices'
              example:
                Id: 918feecb-067a-4ed9-841b-571c04eaada3
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551139338915)/
                PaymentServices:
                  - PaymentServiceID: 00000000-0000-0000-0000-000000000000
                    PaymentServiceName: ACME Payments
                    PaymentServiceUrl: https://www.payupnow.com/
                    PaymentServiceType: Custom
                    PayNowText: Pay Now
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: PaymentServices array with PaymentService object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaymentServices'
            example:
              PaymentServices:
                - PaymentServiceID: 54b3b4f6-0443-4fba-bcd1-61ec0c35ca55
                  PaymentServiceName: PayUpNow
                  PaymentServiceUrl: https://www.payupnow.com/
                  PaymentServiceType: Custom
                  PayNowText: Time To Pay
  /Budgets:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.budgets.read
      tags:
        - Accounting
      operationId: getBudgets
      summary: Retrieve a list of budgets
      parameters:
        - in: query
          name: IDs
          x-snake: ids
          description: Filter by BudgetID. Allows you to retrieve a specific individual budget.
          style: form
          explode: false
          example: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-java: UUID.fromString("00000000-0000-0000-0000-000000000000")
          x-example-php: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-csharp: Guid.Parse("00000000-0000-0000-0000-000000000000");
          schema:
            type: string
            items:
              type: string
              format: uuid
        - in: query
          name: DateTo
          x-snake: date_to
          description: Filter by start date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: DateFrom
          x-snake: date_from
          description: Filter by end date
          example: "2019-10-31"
          schema:
            type: string
            format: date
      responses:
        "200":
          description: Success - return response of type Budgets array with 0 to N Budgets
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Budgets'
              example:
                Id: 04e93d48-e72f-4775-b7dd-15a041fab972
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551399323399)/
                Budgets:
                  - BudgetID: 847da917-9565-466c-a9cd-3ecf7eb9d094
                    Status: APPROVED
                    Description: FY2021 budget
                    Type: TRACKING
                    UpdatedDateUTC: /Date(1622138002077+0000)/
                    BudgetLines: []
                    Tracking: []
                  - BudgetID: 93a4bab1-0021-4320-a2ec-c250528b4bc5
                    Status: APPROVED
                    Description: Overall Budget
                    Type: OVERALL
                    UpdatedDateUTC: /Date(1622137786913+0000)/
                    BudgetLines: []
                    Tracking: []
  /Budgets/{BudgetID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.budgets.read
      tags:
        - Accounting
      operationId: getBudget
      summary: Retrieves a specific budget, which includes budget lines
      parameters:
        - $ref: '#/components/parameters/BudgetID'
        - in: query
          name: DateTo
          x-snake: date_to
          description: Filter by start date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: DateFrom
          x-snake: date_from
          description: Filter by end date
          example: "2019-10-31"
          schema:
            type: string
            format: date
      responses:
        "200":
          description: Success - return response of type Invoices array with specified Invoices
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Budgets'
              example:
                Id: 04e93d48-e72f-4775-b7dd-15a041fab972
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551399323399)/
                Budgets:
                  BudgetID: c1d195d4-92aa-4abd-867a-7ac2f9d60500
                  Type: TRACKING
                  Description: Daniels Northern Budget
                  UpdatedDateUTC: 2017-08-14T01:18:26.74
                  Tracking:
                    - TrackingCategoryID: e94ba240-3edf-4ef3-8317-10147b968f94
                      Name: Region
                      TrackingOptionID: e94ba240-3edf-4ef3-8317-10147b968f94
                      Option: North
                    - TrackingCategoryID: d8580491-4167-4a81-9624-ad3bdd8e46ce
                      Name: Salesperson
                      TrackingOptionID: 9c24de87-a2b7-439d-a216-35d1af7bdec3
                      Option: Daniel
                  BudgetLines:
                    - AccountID: 9c24de87-a2b7-439d-a216-35d1af7bdec3
                      AccountCode: "200"
                      BudgetBalances:
                        - Period: 2019-08
                          Amount: "1000"
                          Notes: Sample note
                        - Period: 2019-09
                          Amount: "1050"
                          Notes: ""
                        - Period: 2019-10
                          Amount: "1102"
                          Notes: ""
                    - AccountID: 385f90ae-e798-4990-9b1c-db8eb8b735c2
                      AccountCode: "420"
                      BudgetBalances:
                        - Period: 2019-08
                          Amount: "500"
                          Notes: ""
                        - Period: 2019-09
                          Amount: "505"
                          Notes: Special Month
                        - Period: 2019-10
                          Amount: "510"
                          Notes: ""
  /Contacts:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContacts
      summary: Retrieves all contacts in a Xero organisation
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: ContactStatus==&quot;ACTIVE&quot;
          x-example-csharp: ContactStatus==\&quot;ACTIVE\&quot;
          x-example-java: ContactStatus==&quot;&apos; + Contact.ContactStatusEnum.ACTIVE + &apos;&quot;
          x-example-php: ContactStatus==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Contact::CONTACT_STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: ContactStatus==#{XeroRuby::Accounting::Contact::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Name ASC
          schema:
            type: string
        - in: query
          name: IDs
          x-snake: ids
          description: Filter by a comma separated list of ContactIDs. Allows you to retrieve a specific set of contacts in a single call.
          style: form
          explode: false
          example: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-java: Arrays.asList(UUID.fromString("00000000-0000-0000-0000-000000000000"))
          x-example-php: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-csharp: new List&lt;Guid&gt;{Guid.Parse("00000000-0000-0000-0000-000000000000")};
          schema:
            type: array
            items:
              type: string
              format: uuid
        - in: query
          name: page
          description: e.g. page=1 - Up to 100 contacts will be returned in a single API call.
          example: 1
          schema:
            type: integer
        - in: query
          name: includeArchived
          x-snake: include_archived
          description: e.g. includeArchived=true - Contacts with a status of ARCHIVED will be included in the response
          example: true
          x-example-python: "True"
          schema:
            type: boolean
        - $ref: '#/components/parameters/summaryOnly'
        - in: query
          name: searchTerm
          x-snake: search_term
          description: Search parameter that performs a case-insensitive text search across the Name, FirstName, LastName, ContactNumber and EmailAddress fields.
          example: Joe Bloggs
          schema:
            type: string
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type Contacts array with 0 to N Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: 04e93d48-e72f-4775-b7dd-15a041fab972
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551399323399)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 2
                Contacts:
                  - ContactID: 5cc8cf28-567e-4d43-b287-687cfcaec47c
                    ContactStatus: ACTIVE
                    Name: Katherine Warren
                    FirstName: Katherine
                    LastName: Warren
                    CompanyNumber: NumberBusiness1234
                    EmailAddress: kat.warren@clampett.com
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        AddressLine1: ""
                        AddressLine2: ""
                        AddressLine3: ""
                        AddressLine4: ""
                        City: Palo Alto
                        Region: CA
                        PostalCode: "94020"
                        Country: United States
                    Phones:
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: DEFAULT
                        PhoneNumber: 847-1294
                        PhoneAreaCode: (626)
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                    UpdatedDateUTC: /Date(1503348544227+0000)/
                    ContactGroups: []
                    IsSupplier: true
                    IsCustomer: true
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    Balances:
                      AccountsReceivable:
                        Outstanding: 760.00
                        Overdue: 920.00
                      AccountsPayable:
                        Outstanding: 231.60
                        Overdue: 360.00
                    ContactPersons: []
                    HasAttachments: false
                    HasValidationErrors: false
                  - ContactID: 3ec601ad-eddc-4ccb-a8ac-736e88293b1b
                    ContactStatus: ACTIVE
                    Name: Lisa Parker
                    FirstName: Lisa
                    LastName: Parker
                    EmailAddress: lparker@parkerandco.com
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        AddressLine1: ""
                        AddressLine2: ""
                        AddressLine3: ""
                        AddressLine4: ""
                        City: Anchorage
                        Region: AK
                        PostalCode: "99501"
                        Country: United States
                    Phones:
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: DEFAULT
                        PhoneNumber: 266-3583
                        PhoneAreaCode: (510)
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                    UpdatedDateUTC: /Date(1503348546760+0000)/
                    ContactGroups: []
                    IsSupplier: false
                    IsCustomer: false
                    ContactPersons: []
                    HasAttachments: false
                    HasValidationErrors: false
    put:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: createContacts
      summary: Creates multiple contacts (bulk) in a Xero organisation
      x-hasAccountingValidationError: true
      x-example:
        - phone:
          is_object: true
          key: phone
          keyPascal: Phone
        - phoneNumber:
          key: phoneNumber
          keyPascal: PhoneNumber
          keySnake: phone_number
          default: 555-1212
          object: phone
        - phoneType:
          is_last: true
          nonString: true
          key: phoneType
          keyPascal: PhoneType
          keySnake: phone_type
          default: MOBILE
          php: XeroAPI\XeroPHP\Models\Accounting\Phone::PHONE_TYPE_MOBILE
          node: Phone.PhoneTypeEnum.MOBILE
          ruby: XeroRuby::Accounting::PhoneType::MOBILE
          python_string: MOBILE
          java: com.xero.models.accounting.Phone.PhoneTypeEnum.MOBILE
          csharp: Phone.PhoneTypeEnum.MOBILE
          object: phone
        - phones:
          is_list: true
          key: phones
          keyPascal: Phone
        - add_phone:
          is_last: true
          is_list_add: true
          key: phones
          keyPascal: Phones
          object: phone
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - name:
          key: name
          keyPascal: Name
          default: Bruce Banner
          object: contact
        - emailAddress:
          key: emailAddress
          keyPascal: EmailAddress
          keySnake: email_address
          default: hulk@avengers.com
          object: contact
        - set_phones:
          is_last: true
          is_variable: true
          nonString: true
          key: phones
          keyPascal: Phones
          default: phones
          object: contact
        - contacts:
          is_object: true
          key: contacts
          keyPascal: Contacts
        - add_contact:
          is_last: true
          is_array_add: true
          key: contacts
          keyPascal: Contacts
          java: Contacts
          csharp: Contact
          object: contact
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Contacts array with newly created Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: e997d6d7-6dad-4458-beb8-d9c1bf7f2edf
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551399321121)/
                Contacts:
                  - ContactID: 3ff6d40c-af9a-40a3-89ce-3c1556a25591
                    ContactStatus: ACTIVE
                    CompanyNumber: NumberBusiness1234
                    Name: Foo9987
                    EmailAddress: sid32476@blah.com
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                    Phones:
                      - PhoneType: DEFAULT
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: 555-1212
                        PhoneAreaCode: "415"
                        PhoneCountryCode: ""
                    UpdatedDateUTC: /Date(1551399321043+0000)/
                    ContactGroups: []
                    IsSupplier: false
                    IsCustomer: false
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    SalesTrackingCategories: []
                    PurchasesTrackingCategories: []
                    PaymentTerms:
                      Bills:
                        Day: 15
                        Type: OFCURRENTMONTH
                      Sales:
                        Day: 10
                        Type: DAYSAFTERBILLMONTH
                    ContactPersons: []
                    HasValidationErrors: false
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - ContactID: 00000000-0000-0000-0000-000000000000
                    AccountNumber: 12345-ABCD
                    Name: Buzz Lightyear
                    EmailAddress: buzzlightyear@email.com
                    AccountsReceivableTaxType: NONE
                    AccountsPayableTaxType: INPUT
                    Addresses:
                      - AddressType: STREET
                        AddressLine1: 101 Green St
                        AddressLine2: 5th floor
                        City: San Francisco
                        Region: CA
                        PostalCode: "94041"
                        Country: US
                        AttentionTo: Rod Drury
                        ValidationErrors: []
                    Phones:
                      - PhoneType: MOBILE
                        PhoneNumber: 555-1212
                        PhoneAreaCode: "415"
                        ValidationErrors: []
                    ContactGroups: []
                    PaymentTerms:
                      Bills:
                        Day: 15
                        Type: OFCURRENTMONTH
                        ValidationErrors: []
                      Sales:
                        Day: 10
                        Type: DAYSAFTERBILLMONTH
                        ValidationErrors: []
                    ContactPersons: []
                    HasValidationErrors: true
                    ValidationErrors:
                      - Message: The contact name Buzz Lightyear is already assigned to another contact. The contact name must be unique across all active contacts.
      requestBody:
        required: true
        description: Contacts with an array of Contact objects to create in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contacts'
            example:
              Contacts:
                - ContactID: 3ff6d40c-af9a-40a3-89ce-3c1556a25591
                  ContactStatus: ACTIVE
                  Name: Foo9987
                  EmailAddress: sid32476@blah.com
                  BankAccountDetails: ""
                  Addresses:
                    - AddressType: STREET
                      City: ""
                      Region: ""
                      PostalCode: ""
                      Country: ""
                    - AddressType: POBOX
                      City: ""
                      Region: ""
                      PostalCode: ""
                      Country: ""
                  Phones:
                    - PhoneType: DEFAULT
                      PhoneNumber: ""
                      PhoneAreaCode: ""
                      PhoneCountryCode: ""
                    - PhoneType: DDI
                      PhoneNumber: ""
                      PhoneAreaCode: ""
                      PhoneCountryCode: ""
                    - PhoneType: FAX
                      PhoneNumber: ""
                      PhoneAreaCode: ""
                      PhoneCountryCode: ""
                    - PhoneType: MOBILE
                      PhoneNumber: 555-1212
                      PhoneAreaCode: "415"
                      PhoneCountryCode: ""
                  UpdatedDateUTC: /Date(1551399321043+0000)/
                  ContactGroups: []
                  IsSupplier: false
                  IsCustomer: false
                  SalesTrackingCategories: []
                  PurchasesTrackingCategories: []
                  PaymentTerms:
                    Bills:
                      Day: 15
                      Type: OFCURRENTMONTH
                    Sales:
                      Day: 10
                      Type: DAYSAFTERBILLMONTH
                  ContactPersons: []
    post:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: updateOrCreateContacts
      summary: Updates or creates one or more contacts in a Xero organisation
      x-hasAccountingValidationError: true
      x-example:
        - phone:
          is_object: true
          key: phone
          keyPascal: Phone
        - phoneNumber:
          key: phoneNumber
          keyPascal: PhoneNumber
          keySnake: phone_number
          default: 555-1212
          object: phone
        - phoneType:
          is_last: true
          nonString: true
          key: phoneType
          keyPascal: PhoneType
          keySnake: phone_type
          default: MOBILE
          php: XeroAPI\XeroPHP\Models\Accounting\Phone::PHONE_TYPE_MOBILE
          node: Phone.PhoneTypeEnum.MOBILE
          ruby: XeroRuby::Accounting::PhoneType::MOBILE
          python_string: MOBILE
          java: com.xero.models.accounting.Phone.PhoneTypeEnum.MOBILE
          csharp: Phone.PhoneTypeEnum.MOBILE
          object: phone
        - phones:
          is_list: true
          key: phones
          keyPascal: Phone
        - add_phone:
          is_last: true
          is_list_add: true
          key: phones
          keyPascal: Phones
          object: phone
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - name:
          key: name
          keyPascal: Name
          default: Bruce Banner
          object: contact
        - emailAddress:
          key: emailAddress
          keyPascal: EmailAddress
          keySnake: email_address
          default: hulk@avengers.com
          object: contact
        - set_phones:
          is_last: true
          is_variable: true
          nonString: true
          key: phones
          keyPascal: Phones
          default: phones
          object: contact
        - contacts:
          is_object: true
          key: contacts
          keyPascal: Contacts
        - add_contact:
          is_last: true
          is_array_add: true
          key: contacts
          keyPascal: Contacts
          java: Contacts
          csharp: Contact
          object: contact
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Contacts array with newly created Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: e997d6d7-6dad-4458-beb8-d9c1bf7f2edf
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551399321121)/
                Contacts:
                  - ContactID: 00000000-0000-0000-0000-000000000000
                    ContactStatus: ACTIVE
                    Name: Bruce Banner
                    CompanyNumber: NumberBusiness1234
                    EmailAddress: bruce@banner.com
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                    Phones:
                      - PhoneType: DEFAULT
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: 555-1212
                        PhoneAreaCode: "415"
                        PhoneCountryCode: ""
                    UpdatedDateUTC: /Date(1551399321043+0000)/
                    ContactGroups: []
                    IsSupplier: false
                    IsCustomer: false
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    SalesTrackingCategories: []
                    PurchasesTrackingCategories: []
                    PaymentTerms:
                      Bills:
                        Day: 15
                        Type: OFCURRENTMONTH
                      Sales:
                        Day: 10
                        Type: DAYSAFTERBILLMONTH
                    ContactPersons: []
                    HasValidationErrors: false
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - ContactID: 00000000-0000-0000-0000-000000000000
                    AccountNumber: 12345-ABCD
                    Name: Buzz Lightyear
                    EmailAddress: buzzlightyear@email.com
                    AccountsReceivableTaxType: NONE
                    AccountsPayableTaxType: INPUT
                    Addresses:
                      - AddressType: STREET
                        AddressLine1: 101 Green St
                        AddressLine2: 5th floor
                        City: San Francisco
                        Region: CA
                        PostalCode: "94041"
                        Country: US
                        AttentionTo: Rod Drury
                        ValidationErrors: []
                    Phones:
                      - PhoneType: MOBILE
                        PhoneNumber: 555-1212
                        PhoneAreaCode: "415"
                        ValidationErrors: []
                    ContactGroups: []
                    PaymentTerms:
                      Bills:
                        Day: 15
                        Type: OFCURRENTMONTH
                        ValidationErrors: []
                      Sales:
                        Day: 10
                        Type: DAYSAFTERBILLMONTH
                        ValidationErrors: []
                    ContactPersons: []
                    HasValidationErrors: true
                    ValidationErrors:
                      - Message: The contact name Buzz Lightyear is already assigned to another contact. The contact name must be unique across all active contacts.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contacts'
            example:
              Contacts:
                - Name: Bruce Banner
                  EmailAddress: hulk@avengers.com
                  Phones:
                    - PhoneType: MOBILE
                      PhoneNumber: 555-1212
                      PhoneAreaCode: "415"
                  PaymentTerms:
                    Bills:
                      Day: 15
                      Type: OFCURRENTMONTH
                    Sales:
                      Day: 10
                      Type: DAYSAFTERBILLMONTH
  /Contacts/{ContactNumber}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContactByContactNumber
      summary: Retrieves a specific contact by contact number in a Xero organisation
      parameters:
        - required: true
          in: path
          name: ContactNumber
          x-snake: contact_number
          description: This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50).
          example: SB2
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Contacts array with a unique Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: 5c83b115-a6e8-4f2a-877f-ba63d009235b
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551462703288)/
                Contacts:
                  - ContactID: 8138a266-fb42-49b2-a104-014b7045753d
                    ContactNumber: SB2
                    AccountNumber: "1234567"
                    ContactStatus: ACTIVE
                    Name: Acme Parts Co.
                    FirstName: Blake
                    LastName: Kohler
                    CompanyNumber: NumberBusiness1234
                    EmailAddress: bk@krave.co
                    BankAccountDetails: "12334567"
                    TaxNumber: 123-22-3456
                    AccountsReceivableTaxType: TAX003
                    AccountsPayableTaxType: TAX022
                    Addresses:
                      - AddressType: STREET
                        AddressLine1: 123 Fake Street
                        City: Vancouver
                        Region: British Columbia
                        PostalCode: V6B 2T4
                        Country: ""
                        AttentionTo: ""
                      - AddressType: POBOX
                        AddressLine1: 1234 Fake Street
                        City: Vancouver
                        Region: British Columbia
                        PostalCode: V6B 2T4
                        Country: ""
                        AttentionTo: Blake
                    Phones:
                      - PhoneType: DDI
                        PhoneNumber: 489-44493
                        PhoneAreaCode: "345"
                        PhoneCountryCode: "4"
                      - PhoneType: DEFAULT
                        PhoneNumber: 408-0914
                        PhoneAreaCode: "604"
                        PhoneCountryCode: "1"
                      - PhoneType: FAX
                        PhoneNumber: 123-9933
                        PhoneAreaCode: "123"
                        PhoneCountryCode: "2"
                      - PhoneType: MOBILE
                        PhoneNumber: 999-44
                        PhoneAreaCode: "234"
                        PhoneCountryCode: "3"
                    UpdatedDateUTC: /Date(1551459777193+0000)/
                    ContactGroups: []
                    IsSupplier: true
                    IsCustomer: true
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    DefaultCurrency: USD
                    Discount: 13.00
                    Website: http://www.google.com
                    BrandingTheme:
                      BrandingThemeID: dabc7637-62c1-4941-8a6e-ee44fa5090e7
                      Name: Standard
                    PurchasesDefaultAccountCode: "660"
                    SalesDefaultAccountCode: "002"
                    BatchPayments:
                      BankAccountNumber: "12334567"
                      BankAccountName: Citi Bank
                      Details: biz checking
                      Code: ""
                      Reference: ""
                    Balances:
                      AccountsReceivable:
                        Outstanding: 118.90
                        Overdue: 136.90
                      AccountsPayable:
                        Outstanding: -43.60
                        Overdue: 40.00
                    PaymentTerms:
                      Bills:
                        Day: 12
                        Type: OFFOLLOWINGMONTH
                      Sales:
                        Day: 14
                        Type: OFCURRENTMONTH
                    ContactPersons:
                      - FirstName: Sue
                        LastName: Johnson
                        EmailAddress: sue.johnson@krave.com
                        IncludeInEmails: true
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 04e0a3e3-b116-456a-9f32-9706f0d33afa
                        FileName: sample5.jpg
                        Url: https://api.xero.com/api.xro/2.0/contact/8138a266-fb42-49b2-a104-014b7045753d/Attachments/sample5.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                    HasValidationErrors: false
  /Contacts/{ContactID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContact
      summary: Retrieves a specific contacts in a Xero organisation using a unique contact Id
      parameters:
        - $ref: '#/components/parameters/ContactID'
      responses:
        "200":
          description: Success - return response of type Contacts array with a unique Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: 5c83b115-a6e8-4f2a-877f-ba63d009235b
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551462703288)/
                Contacts:
                  - ContactID: 8138a266-fb42-49b2-a104-014b7045753d
                    ContactNumber: SB2
                    AccountNumber: "1234567"
                    ContactStatus: ACTIVE
                    Name: Acme Parts Co.
                    FirstName: Blake
                    LastName: Kohler
                    CompanyNumber: NumberBusiness1234
                    EmailAddress: bk@krave.co
                    BankAccountDetails: "12334567"
                    TaxNumber: 123-22-3456
                    AccountsReceivableTaxType: TAX003
                    AccountsPayableTaxType: TAX022
                    Addresses:
                      - AddressType: STREET
                        AddressLine1: 123 Fake Street
                        City: Vancouver
                        Region: British Columbia
                        PostalCode: V6B 2T4
                        Country: ""
                        AttentionTo: ""
                      - AddressType: POBOX
                        AddressLine1: 1234 Fake Street
                        City: Vancouver
                        Region: British Columbia
                        PostalCode: V6B 2T4
                        Country: ""
                        AttentionTo: Blake
                    Phones:
                      - PhoneType: DDI
                        PhoneNumber: 489-44493
                        PhoneAreaCode: "345"
                        PhoneCountryCode: "4"
                      - PhoneType: DEFAULT
                        PhoneNumber: 408-0914
                        PhoneAreaCode: "604"
                        PhoneCountryCode: "1"
                      - PhoneType: FAX
                        PhoneNumber: 123-9933
                        PhoneAreaCode: "123"
                        PhoneCountryCode: "2"
                      - PhoneType: MOBILE
                        PhoneNumber: 999-44
                        PhoneAreaCode: "234"
                        PhoneCountryCode: "3"
                    UpdatedDateUTC: /Date(1551459777193+0000)/
                    ContactGroups: []
                    IsSupplier: true
                    IsCustomer: true
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    DefaultCurrency: USD
                    Discount: 13.00
                    Website: http://www.google.com
                    BrandingTheme:
                      BrandingThemeID: dabc7637-62c1-4941-8a6e-ee44fa5090e7
                      Name: Standard
                    PurchasesDefaultAccountCode: "660"
                    SalesDefaultAccountCode: "002"
                    BatchPayments:
                      BankAccountNumber: "12334567"
                      BankAccountName: Citi Bank
                      Details: biz checking
                      Code: ""
                      Reference: ""
                    Balances:
                      AccountsReceivable:
                        Outstanding: 118.90
                        Overdue: 136.90
                      AccountsPayable:
                        Outstanding: -43.60
                        Overdue: 40.00
                    PaymentTerms:
                      Bills:
                        Day: 12
                        Type: OFFOLLOWINGMONTH
                      Sales:
                        Day: 14
                        Type: OFCURRENTMONTH
                    ContactPersons:
                      - FirstName: Sue
                        LastName: Johnson
                        EmailAddress: sue.johnson@krave.com
                        IncludeInEmails: true
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 04e0a3e3-b116-456a-9f32-9706f0d33afa
                        FileName: sample5.jpg
                        Url: https://api.xero.com/api.xro/2.0/contact/8138a266-fb42-49b2-a104-014b7045753d/Attachments/sample5.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                    HasValidationErrors: false
    post:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: updateContact
      summary: Updates a specific contact in a Xero organisation
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - name:
          key: name
          keyPascal: Name
          default: Thanos
          object: contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - contacts:
          is_object: true
          key: contacts
          keyPascal: Contacts
        - add_contact:
          is_last: true
          is_array_add: true
          key: contacts
          keyPascal: Contacts
          java: Contacts
          csharp: Contact
          object: contact
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactID'
      responses:
        "200":
          description: Success - return response of type Contacts array with an updated Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: 4166b727-c3f0-4881-acd0-d4f7c0e8fcda
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551400031795)/
                Contacts:
                  - ContactID: d5be01fb-b09f-4c3a-9c67-e10c2a03412c
                    ContactStatus: ACTIVE
                    Name: FooBar
                    EmailAddress: sid30680@blah.com
                    BankAccountDetails: ""
                    Addresses:
                      - AddressType: STREET
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                      - AddressType: POBOX
                        City: ""
                        Region: ""
                        PostalCode: ""
                        Country: ""
                    Phones:
                      - PhoneType: DEFAULT
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: DDI
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: FAX
                        PhoneNumber: ""
                        PhoneAreaCode: ""
                        PhoneCountryCode: ""
                      - PhoneType: MOBILE
                        PhoneNumber: 555-1212
                        PhoneAreaCode: "415"
                        PhoneCountryCode: ""
                    UpdatedDateUTC: /Date(1551400031763+0000)/
                    ContactGroups: []
                    IsSupplier: false
                    IsCustomer: false
                    SalesDefaultLineAmountType: INCLUSIVE
                    PurchasesDefaultLineAmountType: INCLUSIVE
                    SalesTrackingCategories: []
                    PurchasesTrackingCategories: []
                    PaymentTerms:
                      Bills:
                        Day: 15
                        Type: OFCURRENTMONTH
                      Sales:
                        Day: 10
                        Type: DAYSAFTERBILLMONTH
                    ContactPersons: []
                    HasValidationErrors: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: an array of Contacts containing single Contact object with properties to update
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contacts'
            example:
              Contacts:
                - ContactID: 00000000-0000-0000-0000-000000000000
                  Name: Thanos
  /Contacts/{ContactID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getContactAttachments
      x-hasAccountingValidationError: true
      summary: Retrieves attachments for a specific contact in a Xero organisation
      responses:
        "200":
          description: Success - return response of type Attachments array with 0 to N Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 0f63b631-a205-496d-b1d2-e6b13a9b497b
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1551483890413)/
                Attachments:
                  - AttachmentID: 04e0a3e3-b116-456a-9f32-9706f0d33afa
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Contacts/8138a266-fb42-49b2-a104-014b7045753d/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
      parameters:
        - $ref: '#/components/parameters/ContactID'
  /Contacts/{ContactID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getContactAttachmentById
      summary: Retrieves a specific attachment from a specific contact using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/ContactID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Contact as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /Contacts/{ContactID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getContactAttachmentByFileName
      summary: Retrieves a specific attachment from a specific contact by file name
      parameters:
        - $ref: '#/components/parameters/ContactID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Contact as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateContactAttachmentByFileName
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with an updated Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 8543ae1a-297c-49b8-bf91-47decac452d5
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551485146555)/
                Attachments:
                  - AttachmentID: 8b537c1b-bbb5-47fd-857e-370c369dda7c
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/Contacts/8138a266-fb42-49b2-a104-014b7045753d/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createContactAttachmentByFileName
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with an newly created Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: a5eddf71-86aa-42f5-99e2-0aaf9caf96b6
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551484292734)/
                Attachments:
                  - AttachmentID: 27e37b01-6996-4ebe-836c-95fd472ad674
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Contacts/8138a266-fb42-49b2-a104-014b7045753d/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /Contacts/{ContactID}/CISSettings:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getContactCISSettings
      summary: Retrieves CIS settings for a specific contact in a Xero organisation
      parameters:
        - $ref: '#/components/parameters/ContactID'
      responses:
        "200":
          description: Success - return response of type CISSettings for a specific Contact
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CISSettings'
              example:
                CISSetting:
                  - CISContractorEnabled: true
                    CISSubContractorEnabled: true
                    Rate: 100
  /Contacts/{ContactID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContactHistory
      summary: Retrieves history records for a specific contact
      parameters:
        - $ref: '#/components/parameters/ContactID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: createContactHistory
      summary: Creates a new history record for a specific contact
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactID'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
  /ContactGroups:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContactGroups
      summary: Retrieves the contact Id and name of each contact group
      parameters:
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="ACTIVE"
          x-example-csharp: Status==\"ACTIVE\"
          x-example-java: Status==&quot;&apos; + ContactGroup.StatusEnum.ACTIVE + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\ContactGroup::STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::ContactGroup::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Name ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Contact Groups array of Contact Group
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ContactGroups'
              example:
                Id: b825df86-1a72-49c9-97dd-36afc7d04bd5
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551746015603)/
                ContactGroups:
                  - ContactGroupID: d7a86b80-8dac-4d89-a334-9dcf5753676c
                    Name: Suppliers
                    Status: ACTIVE
                    Contacts: []
                    HasValidationErrors: false
                  - ContactGroupID: ab089fd4-012f-4043-a6e4-e7be01e87e50
                    Name: Old Group84262
                    Status: ACTIVE
                    Contacts: []
                    HasValidationErrors: false
    put:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: createContactGroup
      summary: Creates a contact group
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contactGroup
          keyPascal: ContactGroup
          keySnake: contact_group
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: VIPs
          object: contactGroup
        - contactGroups:
          is_object: true
          key: contactGroups
          keyPascal: ContactGroups
        - add_ContactGroup:
          is_last: true
          is_array_add: true
          key: contactGroups
          keyPascal: ContactGroups
          keySnake: contact_groups
          java: ContactGroups
          python: contact_group
          ruby: contact_group
          csharp: ContactGroup
          object: contactGroup
      responses:
        "200":
          description: Success - return response of type Contact Groups array of newly created Contact Group
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ContactGroups'
              example:
                Id: 5afe53f9-2271-45b8-9767-88d023b71d34
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551745740920)/
                ContactGroups:
                  - ContactGroupID: d7a86b80-8dac-4d89-a334-9dcf5753676c
                    Name: Suppliers
                    Status: ACTIVE
                    Contacts: []
                    HasValidationErrors: false
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - ContactGroupID: 00000000-0000-0000-0000-000000000000
                    Name: Suppliers
                    Contacts: []
                    HasValidationErrors: true
                    ValidationErrors:
                      - Message: You’ve reached the limit of 100 contact groups.
      requestBody:
        description: ContactGroups with an array of names in request body
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContactGroups'
            example:
              ContactGroups:
                - Name: VIPs
  /ContactGroups/{ContactGroupID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.contacts
            - accounting.contacts.read
      tags:
        - Accounting
      operationId: getContactGroup
      summary: Retrieves a specific contact group by using a unique contact group Id
      parameters:
        - $ref: '#/components/parameters/ContactGroupID'
      responses:
        "200":
          description: Success - return response of type Contact Groups array with a specific Contact Group
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ContactGroups'
              example:
                Id: 079c14f6-2c2d-464e-a2c7-0edf7e465723
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551746772976)/
                ContactGroups:
                  - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                    Name: Oasis
                    Status: ACTIVE
                    Contacts:
                      - ContactID: 4e1753b9-018a-4775-b6aa-1bc7871cfee3
                        Name: Noel Gallagher
                        Addresses: []
                        Phones: []
                        ContactGroups: []
                        ContactPersons: []
                        HasValidationErrors: false
                      - ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                        Name: Liam Gallagher
                        Addresses: []
                        Phones: []
                        ContactGroups: []
                        ContactPersons: []
                        HasValidationErrors: false
                    HasValidationErrors: false
    post:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: updateContactGroup
      summary: Updates a specific contact group
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contactGroup
          keyPascal: ContactGroup
          keySnake: contact_group
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: Vendor
          object: contactGroup
        - contactGroups:
          is_object: true
          key: contactGroups
          keyPascal: ContactGroups
        - add_ContactGroup:
          is_last: true
          is_array_add: true
          key: contactGroups
          keyPascal: ContactGroups
          keySnake: contact_groups
          java: ContactGroups
          python: contact_group
          ruby: contact_group
          csharp: ContactGroup
          object: contactGroup
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactGroupID'
      responses:
        "200":
          description: Success - return response of type Contact Groups array of updated Contact Group
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ContactGroups'
              example:
                Id: b1ba6cdb-1637-4209-bb92-bd0c593f3243
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551746288544)/
                ContactGroups:
                  - ContactGroupID: 13f47537-7c1d-4e62-966e-617d76558fc5
                    Name: Supplier Vendor
                    Status: ACTIVE
                    Contacts: []
                    HasValidationErrors: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: an array of Contact groups with Name of specific group to update
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContactGroups'
            example:
              ContactGroups:
                - Name: Suppliers
  /ContactGroups/{ContactGroupID}/Contacts:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    put:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: createContactGroupContacts
      summary: Creates contacts to a specific contact group
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - contacts:
          is_object: true
          key: contacts
          keyPascal: Contacts
        - add_contact:
          is_last: true
          is_array_add: true
          key: contacts
          keyPascal: Contacts
          java: Contacts
          csharp: Contact
          object: contact
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ContactGroupID'
      responses:
        "200":
          description: Success - return response of type Contacts array of added Contacts
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contacts'
              example:
                Id: 99db8024-6895-45c8-a1b5-54805aa8689c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551747495785)/
                Contacts:
                  - ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                    Addresses: []
                    Phones: []
                    ContactGroups: []
                    ContactPersons: []
                    HasValidationErrors: false
                    ValidationErrors: []
                  - ContactID: 4e1753b9-018a-4775-b6aa-1bc7871cfee3
                    Addresses: []
                    Phones: []
                    ContactGroups: []
                    ContactPersons: []
                    HasValidationErrors: false
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: Contacts with array of contacts specifying the ContactID to be added to ContactGroup in body of request
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contacts'
            example:
              Contacts:
                - ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                - ContactID: 4e1753b9-018a-4775-b6aa-1bc7871cfee3
    delete:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: deleteContactGroupContacts
      summary: Deletes all contacts from a specific contact group
      parameters:
        - $ref: '#/components/parameters/ContactGroupID'
      responses:
        "204":
          description: Success - return response 204 no content
          x-isEmpty: true
  /ContactGroups/{ContactGroupID}/Contacts/{ContactID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    delete:
      security:
        - OAuth2:
            - accounting.contacts
      tags:
        - Accounting
      operationId: deleteContactGroupContact
      summary: Deletes a specific contact from a contact group using a unique contact Id
      parameters:
        - $ref: '#/components/parameters/ContactGroupID'
        - $ref: '#/components/parameters/ContactID'
      responses:
        "204":
          description: Success - return response 204 no content
          x-isEmpty: true
        "400":
          $ref: '#/components/responses/400Error'
  /CreditNotes:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getCreditNotes
      summary: Retrieves any credit notes
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="DRAFT"
          x-example-csharp: Status==\"DRAFT\"
          x-example-java: Status==&quot;&apos; + CreditNote.StatusEnum.DRAFT + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\CreditNote::STATUS_DRAFT . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::CreditNote::DRAFT}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: CreditNoteNumber ASC
          schema:
            type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 credit notes will be returned in a single API call with line items shown for each credit note
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type Credit Notes array of CreditNote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditNotes'
              example:
                Id: 306379b0-3d75-4c77-953a-be08fa0efae8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551812506620)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 2
                CreditNotes:
                  - CreditNoteID: 249f15fa-f2a7-4acc-8769-0984103f2225
                    CreditNoteNumber: CN-0005
                    Payments:
                      - PaymentID: 6b037c9b-2e5d-4905-84d3-eabfb3438242
                        Date: /Date(1552521600000+0000)/
                        Amount: 2.00
                        Reference: Too much
                        CurrencyRate: 1.000000
                        HasAccount: false
                        HasValidationErrors: false
                    ID: 249f15fa-f2a7-4acc-8769-0984103f2225
                    CurrencyRate: 1.000000
                    Type: ACCRECCREDIT
                    Reference: US Tour
                    RemainingCredit: 32.50
                    Allocations: []
                    HasAttachments: true
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-05T00:00:00
                    Date: /Date(1551744000000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 30.00
                    TotalTax: 4.50
                    Total: 34.50
                    UpdatedDateUTC: /Date(1551812346157+0000)/
                    CurrencyCode: NZD
                  - CreditNoteID: f8021bd2-9a6a-4c19-8477-163da0b9290f
                    CreditNoteNumber: ""
                    Payments: []
                    ID: f8021bd2-9a6a-4c19-8477-163da0b9290f
                    CurrencyRate: 1.000000
                    Type: ACCPAYCREDIT
                    Reference: ""
                    RemainingCredit: 46.00
                    Allocations: []
                    HasAttachments: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-01-05T00:00:00
                    Date: /Date(1546646400000+0000)/
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 40.00
                    TotalTax: 6.00
                    Total: 46.00
                    UpdatedDateUTC: /Date(1551812506153+0000)/
                    CurrencyCode: NZD
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createCreditNotes
      summary: Creates a new credit note
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          node: '''2020-12-10'''
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - creditNote:
          is_object: true
          key: creditNote
          keyPascal: CreditNote
          keySnake: credit_note
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: ACCPAYCREDIT
          php: XeroAPI\XeroPHP\Models\Accounting\CreditNote::TYPE_ACCPAYCREDIT
          node: CreditNote.TypeEnum.ACCPAYCREDIT
          ruby: XeroRuby::Accounting::CreditNote::ACCPAYCREDIT
          python_string: ACCPAYCREDIT
          java: com.xero.models.accounting.CreditNote.TypeEnum.ACCPAYCREDIT
          csharp: CreditNote.TypeEnum.ACCPAYCREDIT
          object: creditNote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: creditNote
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: creditNote
        - set_lineitem:
          is_last: true
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: creditNote
        - creditNotes:
          is_object: true
          key: creditNotes
          keyPascal: CreditNotes
        - add_creditNote:
          is_last: true
          is_array_add: true
          key: creditNotes
          keyPascal: CreditNotes
          keySnake: credit_notes
          java: CreditNotes
          python: credit_note
          ruby: credit_note
          csharp: CreditNote
          object: creditNote
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Credit Notes array of newly created CreditNote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditNotes'
              example:
                Id: 5e57a661-42da-4a19-96a0-00405a0e946d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551812702713)/
                CreditNotes:
                  - CreditNoteID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CreditNoteNumber: ""
                    Payments: []
                    ID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CurrencyRate: 1.000000
                    Type: ACCPAYCREDIT
                    Reference: ""
                    RemainingCredit: 46.00
                    Allocations: []
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-01-05T00:00:00
                    Date: /Date(1546646400000+0000)/
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: INPUT2
                        TaxAmount: 6.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                        ValidationErrors: []
                    SubTotal: 40.00
                    TotalTax: 6.00
                    Total: 46.00
                    UpdatedDateUTC: /Date(1551812702650+0000)/
                    CurrencyCode: NZD
                    StatusAttributeString: OK
                    ValidationErrors:
                      - Message: An existing Credit Note with the specified CreditNoteID could not be found
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: Credit Notes with array of CreditNote object in body of request
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreditNotes'
            example:
              CreditNotes:
                - Type: ACCPAYCREDIT
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                  Date: "2019-01-05"
                  LineItems:
                    - Description: Foobar
                      Quantity: 2.0
                      UnitAmount: 20.0
                      AccountCode: "400"
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateCreditNotes
      summary: Updates or creates one or more credit notes
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - creditNote:
          is_object: true
          key: creditNote
          keyPascal: CreditNote
          keySnake: credit_note
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: ACCPAYCREDIT
          php: XeroAPI\XeroPHP\Models\Accounting\CreditNote::TYPE_ACCPAYCREDIT
          node: CreditNote.TypeEnum.ACCPAYCREDIT
          ruby: XeroRuby::Accounting::CreditNote::ACCPAYCREDIT
          python_string: ACCPAYCREDIT
          java: com.xero.models.accounting.CreditNote.TypeEnum.ACCPAYCREDIT
          csharp: CreditNote.TypeEnum.ACCPAYCREDIT
          object: creditNote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: creditNote
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: creditNote
        - set_lineitem:
          is_last: true
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: creditNote
        - creditNotes:
          is_object: true
          key: creditNotes
          keyPascal: CreditNotes
        - add_creditNote:
          is_last: true
          is_array_add: true
          key: creditNotes
          keyPascal: CreditNotes
          keySnake: credit_notes
          java: CreditNotes
          python: credit_note
          ruby: credit_note
          csharp: CreditNote
          object: creditNote
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Credit Notes array of newly created CreditNote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditNotes'
              example:
                Id: 5e57a661-42da-4a19-96a0-00405a0e946d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551812702713)/
                CreditNotes:
                  - CreditNoteID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CreditNoteNumber: ""
                    Payments: []
                    ID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CurrencyRate: 1.000000
                    Type: ACCPAYCREDIT
                    Reference: ""
                    SentToContact: true
                    RemainingCredit: 46.00
                    Allocations: []
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-01-05T00:00:00
                    Date: /Date(1546646400000+0000)/
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: INPUT2
                        TaxAmount: 6.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                        ValidationErrors: []
                    SubTotal: 40.00
                    TotalTax: 6.00
                    Total: 46.00
                    UpdatedDateUTC: /Date(1551812702650+0000)/
                    CurrencyCode: NZD
                    StatusAttributeString: OK
                    ValidationErrors:
                      - Message: An existing Credit Note with the specified CreditNoteID could not be found
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: an array of Credit Notes with a single CreditNote object.
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreditNotes'
            example:
              CreditNotes:
                - Type: ACCPAYCREDIT
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                  Date: "2019-01-05"
                  Status: AUTHORISED
                  Reference: HelloWorld
                  LineItems:
                    - Description: Foobar
                      Quantity: 2.0
                      UnitAmount: 20.0
                      AccountCode: "400"
  /CreditNotes/{CreditNoteID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getCreditNote
      summary: Retrieves a specific credit note using a unique credit note Id
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Credit Notes array with a unique CreditNote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditNotes'
              example:
                Id: dd5c5da7-08ab-486a-ac34-aea295f1614b
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551812703811)/
                CreditNotes:
                  - CreditNoteID: 249f15fa-f2a7-4acc-8769-0984103f2225
                    CreditNoteNumber: CN-0005
                    Payments:
                      - PaymentID: 6b037c9b-2e5d-4905-84d3-eabfb3438242
                        Date: /Date(1552521600000+0000)/
                        Amount: 2.00
                        Reference: Too much
                        CurrencyRate: 1.000000
                        HasAccount: false
                        HasValidationErrors: false
                    ID: 249f15fa-f2a7-4acc-8769-0984103f2225
                    CurrencyRate: 1.000000
                    Type: ACCRECCREDIT
                    Reference: US Tour
                    RemainingCredit: 32.50
                    Allocations: []
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 9b9c9b62-069e-4f5a-a172-183195f084bb
                        FileName: Screen Shot 2019-03-04 at 9.00.06 AM.png
                        Url: https://api.xero.com/api.xro/2.0/creditnotes/249f15fa-f2a7-4acc-8769-0984103f2225/Attachments/Screen%20Shot%202019-03-04%20at%209.00.06%20AM.png
                        MimeType: image/png
                        ContentLength: 82334
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-05T00:00:00
                    Date: /Date(1551744000000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Mic Stand
                        UnitAmount: 30.00
                        TaxType: OUTPUT2
                        TaxAmount: 4.50
                        LineAmount: 30.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        ValidationErrors: []
                    SubTotal: 30.00
                    TotalTax: 4.50
                    Total: 34.50
                    UpdatedDateUTC: /Date(1551812346157+0000)/
                    CurrencyCode: NZD
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateCreditNote
      summary: Updates a specific credit note
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - creditNote:
          is_object: true
          key: creditNote
          keyPascal: CreditNote
          keySnake: credit_note
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: ACCPAYCREDIT
          php: XeroAPI\XeroPHP\Models\Accounting\CreditNote::TYPE_ACCPAYCREDIT
          node: CreditNote.TypeEnum.ACCPAYCREDIT
          ruby: XeroRuby::Accounting::CreditNote::ACCPAYCREDIT
          python_string: ACCPAYCREDIT
          java: com.xero.models.accounting.CreditNote.TypeEnum.ACCPAYCREDIT
          csharp: CreditNote.TypeEnum.ACCPAYCREDIT
          object: creditNote
        - status:
          nonString: true
          key: status
          keyPascal: Status
          default: AUTHORISED
          php: XeroAPI\XeroPHP\Models\Accounting\CreditNote::STATUS_AUTHORISED
          node: CreditNote.StatusEnum.AUTHORISED
          ruby: XeroRuby::Accounting::CreditNote::AUTHORISED
          python_string: AUTHORISED
          java: com.xero.models.accounting.CreditNote.StatusEnum.AUTHORISED
          csharp: CreditNote.StatusEnum.AUTHORISED
          object: creditNote
        - reference:
          key: reference
          keyPascal: Reference
          default: My ref.
          object: creditNote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: creditNote
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: creditNote
        - set_lineitem:
          is_last: true
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: creditNote
        - creditNotes:
          is_object: true
          key: creditNotes
          keyPascal: CreditNotes
        - add_creditNote:
          is_last: true
          is_array_add: true
          key: creditNotes
          keyPascal: CreditNotes
          keySnake: credit_notes
          java: CreditNotes
          python: credit_note
          ruby: credit_note
          csharp: CreditNote
          object: creditNote
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Credit Notes array with updated CreditNote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditNotes'
              example:
                Id: db2f7659-6044-418d-a4c6-d4b93eba4e1e
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551812704253)/
                CreditNotes:
                  - CreditNoteID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CreditNoteNumber: ""
                    Payments: []
                    ID: f9256f04-5a99-4680-acb9-6b4639cc439a
                    CurrencyRate: 1.000000
                    Type: ACCPAYCREDIT
                    Reference: HelloWorld
                    RemainingCredit: 46.00
                    Allocations: []
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-01-05T00:00:00
                    Date: /Date(1546646400000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: INPUT2
                        TaxAmount: 6.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                        ValidationErrors: []
                    SubTotal: 40.00
                    TotalTax: 6.00
                    Total: 46.00
                    UpdatedDateUTC: /Date(1551812704223+0000)/
                    CurrencyCode: NZD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: an array of Credit Notes containing credit note details to update
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreditNotes'
            example:
              CreditNotes:
                - Type: ACCPAYCREDIT
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                  Date: "2019-01-05"
                  Status: AUTHORISED
                  Reference: HelloWorld
                  SentToContact: true
                  LineItems:
                    - Description: Foobar
                      Quantity: 2
                      UnitAmount: 20
                      AccountCode: "400"
  /CreditNotes/{CreditNoteID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getCreditNoteAttachments
      summary: Retrieves attachments for a specific credit notes
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
      responses:
        "200":
          description: Success - return response of type Attachments array with all Attachment for specific Credit Note
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 2bb15054-3868-4f85-a9c6-0402ec8c1201
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551822670731)/
                Attachments:
                  - AttachmentID: b7eb1fc9-a0f9-4e8e-9373-6689f5350832
                    FileName: HelloWorld.png
                    Url: https://api.xero.com/api.xro/2.0/CreditNotes/249f15fa-f2a7-4acc-8769-0984103f2225/Attachments/HelloWorld.png
                    MimeType: image/png
                    ContentLength: 76091
  /CreditNotes/{CreditNoteID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getCreditNoteAttachmentById
      summary: Retrieves a specific attachment from a specific credit note using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Credit Note as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /CreditNotes/{CreditNoteID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getCreditNoteAttachmentByFileName
      summary: Retrieves a specific attachment on a specific credit note by file name
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Credit Note as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateCreditNoteAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates attachments on a specific credit note by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with updated Attachment for specific Credit Note
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 27253066-8c4d-4e34-a251-7a749b72de40
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551828247939)/
                Attachments:
                  - AttachmentID: 103e49f1-e47c-4b4d-b5e8-77d9d00fa70a
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/CreditNotes/249f15fa-f2a7-4acc-8769-0984103f2225/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createCreditNoteAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment for a specific credit note
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/includeOnline'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Attachments array with newly created Attachment for specific Credit Note
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 22a8d402-5dea-40ed-9d01-26896429f649
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551822953320)/
                Attachments:
                  - AttachmentID: 91bbae3f-5de5-4e3d-875f-8662f25897bd
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/CreditNotes/249f15fa-f2a7-4acc-8769-0984103f2225/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /CreditNotes/{CreditNoteID}/pdf:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getCreditNoteAsPdf
      x-path: /CreditNotes/{CreditNoteID}
      summary: Retrieves credit notes as PDF files
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
      responses:
        "200":
          description: Success - return response of binary data from the Attachment to a Credit Note
          content:
            application/pdf:
              schema:
                type: string
                format: binary
  /CreditNotes/{CreditNoteID}/Allocations:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createCreditNoteAllocation
      summary: Creates allocation for a specific credit note
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - allocation:
          is_object: true
          key: allocation
          keyPascal: Allocation
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          csharp: new decimal(1.0)
          object: allocation
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: allocation
        - set_invoice:
          is_last: true
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: allocation
        - allocations:
          is_object: true
          key: allocations
          keyPascal: Allocations
        - add_allocation:
          is_last: true
          is_array_add: true
          key: allocations
          keyPascal: Allocations
          java: Allocations
          csharp: Allocation
          object: allocation
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Allocations array with newly created Allocation for specific Credit Note
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocations'
              example:
                Id: 73452751-6eaa-4bcb-86f5-4c013316f4cf
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551828543255)/
                Allocations:
                  - Amount: 1.00
                    Date: /Date(1551744000000+0000)/
                    Invoice:
                      InvoiceID: c45720a1-ade3-4a38-a064-d15489be6841
                      Payments: []
                      CreditNotes: []
                      Prepayments: []
                      Overpayments: []
                      HasErrors: false
                      IsDiscounted: false
                      LineItems: []
                      ValidationErrors: []
                    CreditNote:
                      CreditNoteID: 7be578f5-63af-45c8-9b00-dcc4732baf0b
                      ID: 7be578f5-63af-45c8-9b00-dcc4732baf0b
                      LineItems: []
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        description: Allocations with array of Allocation object in body of request.
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Allocations'
            example:
              Allocations:
                - Invoice:
                    LineItems: []
                    InvoiceID: c45720a1-ade3-4a38-a064-d15489be6841
                  Amount: 1
                  Date: "2019-03-05"
  /CreditNotes/{CreditNoteID}/Allocations/{AllocationID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    delete:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deleteCreditNoteAllocations
      summary: Deletes an Allocation from a Credit Note
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
        - $ref: '#/components/parameters/AllocationID'
      responses:
        "200":
          description: Success - return response of type Allocation with the isDeleted flag as true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocation'
              example:
                AllocationId: 2bb15054-3868-4f85-a9c6-0402ec8c1201
                Date: /Date(1551822670731)/
                Invoice:
                  - InvoiceID: b7eb1fc9-a0f9-4e8e-9373-6689f5350832
                IsDeleted: true
  /CreditNotes/{CreditNoteID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getCreditNoteHistory
      summary: Retrieves history records of a specific credit note
      parameters:
        - $ref: '#/components/parameters/CreditNoteID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createCreditNoteHistory
      summary: Retrieves history records of a specific credit note
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/CreditNoteID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Currencies:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getCurrencies
      summary: Retrieves currencies for your Xero organisation
      parameters:
        - in: query
          name: where
          description: Filter by an any element
          example: Code=="USD"
          x-example-csharp: Code==\"USD\"
          x-example-php: Code==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\CurrencyCode::USD . &apos;&quot;
          x-example-ruby: Code==#{XeroRuby::Accounting::CurrencyCode::USD}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Code ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Currencies array with all Currencies
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Currencies'
              example:
                Id: e6803fc8-8035-4251-b3e4-39d6b2de0f4a
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552322853043)/
                Currencies:
                  - Code: NZD
                    Description: New Zealand Dollar
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createCurrency
      summary: Create a new currency for a Xero organisation
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - currency:
          is_object: true
          key: currency
          keyPascal: Currency
        - code:
          nonString: true
          key: code
          keyPascal: Code
          default: USD
          php: XeroAPI\XeroPHP\Models\Accounting\CurrencyCode::USD
          node: CurrencyCode.USD
          ruby: XeroRuby::Accounting::CurrencyCode::USD
          python: CurrencyCode.USD
          java: com.xero.models.accounting.CurrencyCode.USD
          csharp: CurrencyCode.USD
          object: currency
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: United States Dollar
          object: currency
      responses:
        "200":
          description: Unsupported - return response incorrect exception, API is not able to create new Currency
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Currencies'
              example:
                Currencies:
                  - Code: USD
                    Description: United States Dollar
      requestBody:
        required: true
        description: Currency object in the body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Currency'
            example:
              Code: USD
              Description: United States Dollar
  /Employees:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getEmployees
      summary: Retrieves employees used in Xero payrun
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="ACTIVE"
          x-example-csharp: Status==\"ACTIVE\"
          x-example-java: Status==&quot;&apos; + Employee.StatusEnum.ACTIVE + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Employee::STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Employee::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: LastName ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Employees array with all Employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employees'
              example:
                Id: 593cbccc-5cd2-4cd2-be5e-150f0843709e
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325082775)/
                Employees:
                  - EmployeeID: 972615c5-ad3d-47a0-b579-20370d374578
                    Status: ACTIVE
                    FirstName: Tony
                    LastName: Stark
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Stark+Industries
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552324681593+0000)/
                  - EmployeeID: ad3db144-6362-459c-8c36-5d31d196e629
                    Status: ACTIVE
                    FirstName: Bruce
                    LastName: Banner
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Nick+Fury
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552325081303+0000)/
                  - EmployeeID: e1ada26b-a10e-4065-a941-af34b53740e3
                    Status: ACTIVE
                    FirstName: Nick
                    LastName: Fury
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Nick+Fury
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552324737990+0000)/
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createEmployees
      summary: Creates new employees used in Xero payrun
      x-hasAccountingValidationError: true
      x-example:
        - employee:
          is_object: true
          key: employee
          keyPascal: Employee
        - firstName:
          key: firstName
          keyPascal: FirstName
          keySnake: first_name
          default: Nick
          object: employee
        - lastName:
          is_last: true
          key: lastName
          keyPascal: LastName
          keySnake: last_name
          default: Fury
          object: employee
        - employees:
          is_object: true
          key: employees
          keyPascal: Employees
        - add_employee:
          is_last: true
          is_array_add: true
          key: employees
          keyPascal: Employees
          java: Employees
          csharp: Employee
          object: employee
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Employees array with new Employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employees'
              example:
                Id: 0d6a08e7-6936-4828-a1bc-e4595e0ef778
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552324736508)/
                Employees:
                  - EmployeeID: e1ada26b-a10e-4065-a941-af34b53740e3
                    Status: ACTIVE
                    FirstName: Nick
                    LastName: Fury
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Nick+Fury
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552324736463+0000)/
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Employees with array of Employee object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employees'
            example:
              Employees:
                - FirstName: Nick
                  LastName: Fury
                  ExternalLink:
                    Url: http://twitter.com/#!/search/Nick+Fury
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateOrCreateEmployees
      summary: Creates a single new employees used in Xero payrun
      x-hasAccountingValidationError: true
      x-example:
        - employee:
          is_object: true
          key: employee
          keyPascal: Employee
        - firstName:
          key: firstName
          keyPascal: FirstName
          keySnake: first_name
          default: Nick
          object: employee
        - lastName:
          is_last: true
          key: lastName
          keyPascal: LastName
          keySnake: last_name
          default: Fury
          object: employee
        - employees:
          is_object: true
          key: employees
          keyPascal: Employees
        - add_employee:
          is_last: true
          is_array_add: true
          key: employees
          keyPascal: Employees
          java: Employees
          csharp: Employee
          object: employee
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Employees array with new Employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employees'
              example:
                Id: 0d6a08e7-6936-4828-a1bc-e4595e0ef778
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552324736508)/
                Employees:
                  - EmployeeID: e1ada26b-a10e-4065-a941-af34b53740e3
                    Status: ACTIVE
                    FirstName: Nick
                    LastName: Fury
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Nick+Fury
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552324736463+0000)/
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Employees with array of Employee object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employees'
            example:
              Employees:
                - FirstName: Nick
                  LastName: Fury
                  ExternalLink:
                    Url: http://twitter.com/#!/search/Nick+Fury
  /Employees/{EmployeeID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getEmployee
      summary: Retrieves a specific employee used in Xero payrun using a unique employee Id
      parameters:
        - $ref: '#/components/parameters/EmployeeID'
      responses:
        "200":
          description: Success - return response of type Employees array with specified Employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employees'
              example:
                Id: 417a529e-4f8d-4b1a-8816-7100245cf8b2
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325084085)/
                Employees:
                  - EmployeeID: 972615c5-ad3d-47a0-b579-20370d374578
                    Status: ACTIVE
                    FirstName: Tony
                    LastName: Stark
                    ExternalLink:
                      Url: http://twitter.com/#!/search/Stark+Industries
                      Description: Go to external link
                    UpdatedDateUTC: /Date(1552324681593+0000)/
  /ExpenseClaims:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getExpenseClaims
      summary: Retrieves expense claims
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="SUBMITTED"
          x-example-csharp: Status==\"SUBMITTED\"
          x-example-java: Status==&quot;&apos; + ExpenseClaim.StatusEnum.SUBMITTED + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\ExpenseClaim::STATUS_SUBMITTED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::ExpenseClaim::SUBMITTED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Status ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type ExpenseClaims array with all ExpenseClaims
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExpenseClaims'
              example:
                Id: f6a8867e-af29-41ee-8f77-855f5ff214fe
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325853538)/
                ExpenseClaims:
                  - ExpenseClaimID: 646b15ab-b874-4e13-82ae-f4385b2ac4b6
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1552325851767+0000)/
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Receipts: []
                    Payments: []
                    Total: 40.00
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    ReportingDate: /Date(1552262400000+0000)/
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createExpenseClaims
      summary: Creates expense claims
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - user:
          is_object: true
          key: user
          keyPascal: User
        - userID:
          is_last: true
          is_uuid: true
          key: userID
          keyPascal: UserID
          keySnake: user_id
          default: 00000000-0000-0000-0000-000000000000
          object: user
        - receipt:
          is_object: true
          key: receipt
          keyPascal: Receipt
        - receiptID:
          is_uuid: true
          key: receiptID
          keyPascal: ReceiptID
          keySnake: receipt_id
          default: 00000000-0000-0000-0000-000000000000
          object: receipt
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: receipt
        - receipts:
          is_list: true
          key: receipts
          keyPascal: Receipt
        - add_receipts:
          is_last: true
          is_list_add: true
          key: receipts
          keyPascal: Receipts
          object: receipt
        - expenseClaim:
          is_object: true
          key: expenseClaim
          keyPascal: ExpenseClaim
          keySnake: expense_claim
        - status:
          nonString: true
          key: status
          keyPascal: Status
          default: SUBMITTED
          php: XeroAPI\XeroPHP\Models\Accounting\ExpenseClaim::STATUS_SUBMITTED
          node: ExpenseClaim.StatusEnum.SUBMITTED
          ruby: XeroRuby::Accounting::ExpenseClaim::SUBMITTED
          python_string: SUBMITTED
          java: com.xero.models.accounting.ExpenseClaim.StatusEnum.SUBMITTED
          csharp: ExpenseClaim.StatusEnum.SUBMITTED
          object: expenseClaim
        - set_user:
          is_variable: true
          nonString: true
          key: user
          keyPascal: User
          default: user
          object: expenseClaim
        - set_receipt:
          is_last: true
          is_variable: true
          nonString: true
          key: receipts
          keyPascal: Receipts
          default: receipts
          object: expenseClaim
        - expenseClaims:
          is_object: true
          key: expenseClaims
          keyPascal: ExpenseClaims
        - add_expenseClaim:
          is_array_add: true
          is_last: true
          key: expenseClaims
          keyPascal: ExpenseClaims
          keySnake: expense_claims
          java: ExpenseClaims
          python: expense_claim
          ruby: expense_claim
          csharp: ExpenseClaim
          object: expenseClaim
      requestBody:
        required: true
        description: ExpenseClaims with array of ExpenseClaim object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExpenseClaims'
            example:
              ExpenseClaims:
                - Status: SUBMITTED
                  User:
                    UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                  Receipts:
                    - Lineitems: []
                      ReceiptID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
      responses:
        "200":
          description: Success - return response of type ExpenseClaims array with newly created ExpenseClaim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExpenseClaims'
              example:
                Id: 4a0879a6-3860-4b73-adc6-f6a0e0f68fc8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325850201)/
                ExpenseClaims:
                  - ExpenseClaimID: 646b15ab-b874-4e13-82ae-f4385b2ac4b6
                    Status: SUBMITTED
                    UpdatedDateUTC: /Date(1552325850107+0000)/
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Receipts:
                      - ReceiptID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        ReceiptNumber: 1
                        Status: SUBMITTED
                        User:
                          UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                          EmailAddress: api@xero.com
                          FirstName: 'API '
                          LastName: Team
                          UpdatedDateUTC: /Date(1511957179217+0000)/
                          IsSubscriber: true
                          OrganisationRole: FINANCIALADVISER
                        Contact:
                          ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                          Name: Liam Gallagher
                          Addresses: []
                          Phones: []
                          ContactGroups: []
                          ContactPersons: []
                          HasValidationErrors: false
                        Date: /Date(1552348800000+0000)/
                        UpdatedDateUTC: /Date(1552325848457+0000)/
                        Reference: ""
                        LineAmountTypes: NoTax
                        LineItems:
                          - Description: Foobar
                            UnitAmount: 20.00
                            TaxType: NONE
                            TaxAmount: 0.00
                            LineAmount: 40.00
                            Tracking: []
                            Quantity: 2.0000
                        SubTotal: 40.00
                        TotalTax: 0.00
                        Total: 40.00
                        ID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        HasAttachments: false
                    Payments: []
                    Total: 40.00
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    StatusAttributeString: OK
        "400":
          $ref: '#/components/responses/400Error'
  /ExpenseClaims/{ExpenseClaimID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getExpenseClaim
      summary: Retrieves a specific expense claim using a unique expense claim Id
      parameters:
        - $ref: '#/components/parameters/ExpenseClaimID'
      responses:
        "200":
          description: Success - return response of type ExpenseClaims array with specified ExpenseClaim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExpenseClaims'
              example:
                Id: b54bb45d-37da-4f53-9f1d-536302d6bad7
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325854864)/
                ExpenseClaims:
                  - ExpenseClaimID: 646b15ab-b874-4e13-82ae-f4385b2ac4b6
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1552325851767+0000)/
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Receipts:
                      - ReceiptID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        ReceiptNumber: 1
                        Status: AUTHORISED
                        User:
                          UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                          EmailAddress: api@xero.com
                          FirstName: 'API '
                          LastName: Team
                          UpdatedDateUTC: /Date(1511957179217+0000)/
                          IsSubscriber: true
                          OrganisationRole: FINANCIALADVISER
                        Contact:
                          ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                          Name: Liam Gallagher
                          Addresses: []
                          Phones: []
                          ContactGroups: []
                          ContactPersons: []
                          HasValidationErrors: false
                        Date: /Date(1552348800000+0000)/
                        UpdatedDateUTC: /Date(1552325848457+0000)/
                        Reference: ""
                        LineAmountTypes: NoTax
                        LineItems:
                          - Description: Foobar
                            UnitAmount: 20.00
                            TaxType: NONE
                            TaxAmount: 0.00
                            LineAmount: 40.00
                            AccountCode: "400"
                            Tracking: []
                            Quantity: 2.0000
                        SubTotal: 40.00
                        TotalTax: 0.00
                        Total: 40.00
                        ID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        HasAttachments: false
                    Payments: []
                    Total: 40.00
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    ReportingDate: /Date(1552262400000+0000)/
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateExpenseClaim
      summary: Updates a specific expense claims
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - user:
          is_object: true
          key: user
          keyPascal: User
        - userID:
          is_last: true
          is_uuid: true
          key: userID
          keyPascal: UserID
          keySnake: user_id
          default: 00000000-0000-0000-0000-000000000000
          object: user
        - receipt:
          is_object: true
          key: receipt
          keyPascal: Receipt
        - receiptID:
          is_uuid: true
          key: receiptID
          keyPascal: ReceiptID
          keySnake: receipt_id
          default: 00000000-0000-0000-0000-000000000000
          object: receipt
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: receipt
        - receipts:
          is_list: true
          key: receipts
          keyPascal: Receipt
        - add_receipts:
          is_last: true
          is_list_add: true
          key: receipts
          keyPascal: Receipts
          object: receipt
        - expenseClaim:
          is_object: true
          key: expenseClaim
          keyPascal: ExpenseClaim
          keySnake: expense_claim
        - status:
          nonString: true
          key: status
          keyPascal: Status
          default: SUBMITTED
          php: XeroAPI\XeroPHP\Models\Accounting\ExpenseClaim::STATUS_SUBMITTED
          node: ExpenseClaim.StatusEnum.SUBMITTED
          ruby: XeroRuby::Accounting::ExpenseClaim::SUBMITTED
          python_string: SUBMITTED
          java: com.xero.models.accounting.ExpenseClaim.StatusEnum.SUBMITTED
          csharp: ExpenseClaim.StatusEnum.SUBMITTED
          object: expenseClaim
        - set_user:
          is_variable: true
          nonString: true
          key: user
          keyPascal: User
          default: user
          object: expenseClaim
        - set_receipt:
          is_last: true
          is_variable: true
          nonString: true
          key: receipts
          keyPascal: Receipts
          default: receipts
          object: expenseClaim
        - expenseClaims:
          is_object: true
          key: expenseClaims
          keyPascal: ExpenseClaims
        - add_expenseClaim:
          is_array_add: true
          is_last: true
          key: expenseClaims
          keyPascal: ExpenseClaims
          keySnake: expense_claims
          java: ExpenseClaims
          python: expense_claim
          ruby: expense_claim
          csharp: ExpenseClaim
          object: expenseClaim
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ExpenseClaimID'
      responses:
        "200":
          description: Success - return response of type ExpenseClaims array with updated ExpenseClaim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExpenseClaims'
              example:
                Id: 8ee87f9c-058b-4f1b-b5b2-29569bf055d7
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552325851907)/
                ExpenseClaims:
                  - ExpenseClaimID: 646b15ab-b874-4e13-82ae-f4385b2ac4b6
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1552325851767+0000)/
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Receipts:
                      - ReceiptID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        ReceiptNumber: 1
                        Status: AUTHORISED
                        User:
                          UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                          EmailAddress: api@xero.com
                          FirstName: 'API '
                          LastName: Team
                          UpdatedDateUTC: /Date(1511957179217+0000)/
                          IsSubscriber: true
                          OrganisationRole: FINANCIALADVISER
                        Contact:
                          ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                          Name: Liam Gallagher
                          Addresses: []
                          Phones: []
                          ContactGroups: []
                          ContactPersons: []
                          HasValidationErrors: false
                        Date: /Date(1552348800000+0000)/
                        UpdatedDateUTC: /Date(1552325848457+0000)/
                        Reference: ""
                        LineAmountTypes: NoTax
                        LineItems:
                          - Description: Foobar
                            UnitAmount: 20.00
                            TaxType: NONE
                            TaxAmount: 0.00
                            LineAmount: 40.00
                            AccountCode: "400"
                            Tracking: []
                            Quantity: 2.0000
                        SubTotal: 40.00
                        TotalTax: 0.00
                        Total: 40.00
                        ID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
                        HasAttachments: false
                    Payments: []
                    Total: 40.00
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    ReportingDate: /Date(1552262400000+0000)/
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExpenseClaims'
            example:
              ExpenseClaims:
                - Status: SUBMITTED
                  User:
                    UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                  Receipts:
                    - Lineitems: []
                      ReceiptID: dc1c7f6d-0a4c-402f-acac-551d62ce5816
  /ExpenseClaims/{ExpenseClaimID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getExpenseClaimHistory
      summary: Retrieves history records of a specific expense claim
      parameters:
        - $ref: '#/components/parameters/ExpenseClaimID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createExpenseClaimHistory
      summary: Creates a history record for a specific expense claim
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ExpenseClaimID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Invoices:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getInvoices
      summary: Retrieves sales invoices or purchase bills
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="DRAFT"
          x-example-java: Status==&quot;&apos; + Invoice.StatusEnum.DRAFT + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Invoice::STATUS_DRAFT . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Invoice::DRAFT}
          x-example-csharp: Status==\"DRAFT\"
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: InvoiceNumber ASC
          schema:
            type: string
        - in: query
          name: IDs
          x-snake: ids
          description: Filter by a comma-separated list of InvoicesIDs.
          style: form
          explode: false
          example: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-java: Arrays.asList(UUID.fromString("00000000-0000-0000-0000-000000000000"))
          x-example-php: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-csharp: new List&lt;Guid&gt;{Guid.Parse("00000000-0000-0000-0000-000000000000")};
          schema:
            type: array
            items:
              type: string
              format: uuid
        - in: query
          name: InvoiceNumbers
          x-snake: invoice_numbers
          description: Filter by a comma-separated list of InvoiceNumbers.
          style: form
          explode: false
          example: '&quot;INV-001&quot;, &quot;INV-002&quot;'
          x-example-java: Arrays.asList("INV-001","INV-002")
          x-example-php: '&quot;INV-001&quot;, &quot;INV-002&quot;'
          x-example-csharp: new List&lt;string&gt;{&quotINV-001&quot,&quotINV-002&quot};
          schema:
            type: array
            items:
              type: string
        - in: query
          name: ContactIDs
          x-snake: contact_ids
          description: Filter by a comma-separated list of ContactIDs.
          style: form
          explode: false
          example: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-java: Arrays.asList(UUID.fromString("00000000-0000-0000-0000-000000000000"))
          x-example-php: '&quot;00000000-0000-0000-0000-000000000000&quot;'
          x-example-csharp: new List&lt;Guid&gt;{Guid.Parse(&quot00000000-0000-0000-0000-000000000000&quot)};
          schema:
            type: array
            items:
              type: string
              format: uuid
        - in: query
          name: Statuses
          x-snake: statuses
          description: Filter by a comma-separated list Statuses. For faster response times we recommend using these explicit parameters instead of passing OR conditions into the Where filter.
          explode: false
          example: '&quot;DRAFT&quot;, &quot;SUBMITTED&quot;'
          x-example-java: Arrays.asList("DRAFT","SUBMITTED")
          x-example-php: '&quot;DRAFT&quot;, &quot;SUBMITTED&quot;'
          x-example-csharp: new List&lt;string&gt;{&quotDRAFT&quot,&quotSUBMITTED&quot};
          schema:
            type: array
            items:
              type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 invoices will be returned in a single API call with line items shown for each invoice
          example: 1
          schema:
            type: integer
        - in: query
          name: includeArchived
          x-snake: include_archived
          description: e.g. includeArchived=true - Invoices with a status of ARCHIVED will be included in the response
          example: true
          x-example-python: "True"
          schema:
            type: boolean
        - in: query
          name: createdByMyApp
          x-snake: created_by_my_app
          description: When set to true you'll only retrieve Invoices created by your app
          example: false
          x-example-python: "False"
          schema:
            type: boolean
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/summaryOnly'
        - $ref: '#/components/parameters/pageSize'
        - $ref: '#/components/parameters/searchTerm'
      responses:
        "200":
          description: Success - return response of type Invoices array with all Invoices
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invoices'
              example:
                Id: 900c500b-e83c-4ce2-902a-b8ba04751748
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552326816230)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 3
                Invoices:
                  - Type: ACCREC
                    InvoiceID: d4956132-ed94-4dd7-9eaa-aa22dfdf06f2
                    InvoiceNumber: INV-0001
                    Reference: Red Fish, Blue Fish
                    Payments: []
                    CreditNotes: []
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 0.00
                    AmountPaid: 0.00
                    AmountCredited: 0.00
                    SentToContact: true
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    HasAttachments: false
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                      Name: Barney Rubble-83203
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2018-10-20T00:00:00
                    Date: /Date(1539993600000+0000)/
                    DueDateString: 2018-12-30T00:00:00
                    DueDate: /Date(1546128000000+0000)/
                    Status: VOIDED
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    UpdatedDateUTC: /Date(1541176290160+0000)/
                    CurrencyCode: NZD
                  - Type: ACCREC
                    InvoiceID: 046d8a6d-1ae1-4b4d-9340-5601bdf41b87
                    InvoiceNumber: INV-0002
                    Reference: Red Fish, Blue Fish
                    Payments:
                      - PaymentID: 99ea7f6b-c513-4066-bc27-b7c65dcd76c2
                        Date: /Date(1543449600000+0000)/
                        Amount: 46.00
                        CurrencyRate: 1.000000
                        HasAccount: false
                        HasValidationErrors: false
                    CreditNotes: []
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 0.00
                    AmountPaid: 46.00
                    AmountCredited: 0.00
                    SentToContact: true
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    HasAttachments: false
                    Contact:
                      ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                      Name: Barney Rubble-83203
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2018-10-20T00:00:00
                    Date: /Date(1539993600000+0000)/
                    DueDateString: 2018-12-30T00:00:00
                    DueDate: /Date(1546128000000+0000)/
                    Status: PAID
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 40.00
                    TotalTax: 6.00
                    Total: 46.00
                    UpdatedDateUTC: /Date(1541176592690+0000)/
                    CurrencyCode: NZD
                    FullyPaidOnDate: /Date(1543449600000+0000)/
                  - Type: ACCREC
                    InvoiceID: 7ef31b20-de17-4312-8382-412f869b1510
                    InvoiceNumber: INV-0003
                    Reference: ""
                    Payments: []
                    CreditNotes: []
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 115.00
                    AmountPaid: 0.00
                    AmountCredited: 0.00
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    HasAttachments: false
                    Contact:
                      ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                      Name: Barney Rubble-83203
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2018-11-02T00:00:00
                    Date: /Date(1541116800000+0000)/
                    DueDateString: 2018-11-07T00:00:00
                    DueDate: /Date(1541548800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 100.00
                    TotalTax: 15.00
                    Total: 115.00
                    UpdatedDateUTC: /Date(1541176648927+0000)/
                    CurrencyCode: NZD
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createInvoices
      summary: Creates one or more sales invoices or purchase bills
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.of(2020, Month.OCTOBER, 10)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-10-10T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - dueDateValue:
          is_date: true
          key: dueDateValue
          keyPascal: Date
          keySnake: due_date_value
          java_datatype: LocalDate
          csharp_datatype: DateTime
          default: LocalDate.of(2020, Month.OCTOBER, 28)
          java: LocalDate.of(2020, Month.OCTOBER, 28)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-28')
          node: '''2020-10-28'''
          python: dateutil.parser.parse('2020-10-28T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItemTracking:
          is_object: true
          key: lineItemTracking
          keyPascal: LineItemTracking
          keySnake: line_item_tracking
        - trackingCategoryId:
          is_uuid: true
          key: trackingCategoryID
          keyPascal: TrackingCategoryID
          keySnake: tracking_category_id
          default: 00000000-0000-0000-0000-000000000000
          object: lineItemTracking
        - trackingOptionID:
          is_last: true
          is_uuid: true
          key: trackingOptionID
          keyPascal: TrackingOptionID
          keySnake: tracking_option_id
          default: 00000000-0000-0000-0000-000000000000
          object: lineItemTracking
        - lineItemTrackings:
          is_list: true
          key: lineItemTrackings
          keyPascal: LineItemTracking
          keySnake: line_item_trackings
        - add_lineitemtrackings:
          is_last: true
          is_list_add: true
          key: lineItemTrackings
          keyPascal: LineItemTrackings
          keySnake: line_item_trackings
          python: line_item_tracking
          ruby: line_item_tracking
          object: lineItemTracking
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - tracking:
          is_last: true
          nonString: true
          key: tracking
          keyPascal: Tracking
          default: lineItemTrackings
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: ACCREC
          php: XeroAPI\XeroPHP\Models\Accounting\Invoice::TYPE_ACCREC
          node: Invoice.TypeEnum.ACCREC
          ruby: XeroRuby::Accounting::Invoice::ACCREC
          python_string: ACCREC
          java: com.xero.models.accounting.Invoice.TypeEnum.ACCREC
          csharp: Invoice.TypeEnum.ACCREC
          object: invoice
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: invoice
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: invoice
        - dueDate:
          is_variable: true
          nonString: true
          key: dueDate
          keyPascal: DueDate
          keySnake: due_date
          default: dueDateValue
          python: due_date_value
          ruby: due_date_value
          object: invoice
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: invoice
        - reference:
          key: reference
          keyPascal: Reference
          default: Website Design
          object: invoice
        - status:
          is_last: true
          nonString: true
          key: status
          keyPascal: Status
          default: DRAFT
          php: XeroAPI\XeroPHP\Models\Accounting\Invoice::STATUS_DRAFT
          node: Invoice.StatusEnum.DRAFT
          ruby: XeroRuby::Accounting::Invoice::DRAFT
          python_string: DRAFT
          java: com.xero.models.accounting.Invoice.StatusEnum.DRAFT
          csharp: Invoice.StatusEnum.DRAFT
          object: invoice
        - invoices:
          is_object: true
          key: invoices
          keyPascal: Invoices
        - add_invoice:
          is_last: true
          is_array_add: true
          key: invoices
          keyPascal: Invoices
          java: Invoices
          csharp: Invoice
          object: invoice
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Invoices array with newly created Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invoices'
              example:
                Id: ccece84a-075c-4fcd-9073-149d4f7a91cf
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552327126164)/
                Invoices:
                  - Type: ACCREC
                    InvoiceID: ed255415-e141-4150-aab7-89c3bbbb851c
                    InvoiceNumber: INV-0007
                    Reference: Website Design
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    SentToContact: false
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons:
                        - FirstName: Debbie
                          LastName: Gwyther
                          EmailAddress: debbie@rockstar.com
                          IncludeInEmails: false
                      HasValidationErrors: false
                    DateString: 2019-03-11T00:00:00
                    Date: /Date(1552262400000+0000)/
                    DueDateString: 2018-12-10T00:00:00
                    DueDate: /Date(1544400000000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Acme Tires
                        UnitAmount: 20.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 40.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 2.0000
                        LineItemID: 5f7a612b-fdcc-4d33-90fa-a9f6bc6db32f
                        ValidationErrors: []
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    UpdatedDateUTC: /Date(1552327126117+0000)/
                    CurrencyCode: NZD
                    StatusAttributeString: OK
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Invoices with an array of invoice objects in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Invoices'
            example:
              Invoices:
                - Type: ACCREC
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                  LineItems:
                    - Description: Acme Tires
                      Quantity: 2
                      UnitAmount: 20
                      AccountCode: "200"
                      TaxType: NONE
                      LineAmount: 40
                  Date: "2019-03-11"
                  DueDate: "2018-12-10"
                  Reference: Website Design
                  Status: AUTHORISED
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateInvoices
      summary: Updates or creates one or more sales invoices or purchase bills
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.of(2020, Month.OCTOBER, 10)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-10-10T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - dueDateValue:
          is_date: true
          key: dueDateValue
          keyPascal: Date
          keySnake: due_date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 28)
          java: LocalDate.of(2020, Month.OCTOBER, 28)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-28')
          node: '''2020-10-28'''
          python: dateutil.parser.parse('2020-10-28T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - type:
          nonString: true
          key: type
          keyPascal: Type
          default: ACCREC
          php: XeroAPI\XeroPHP\Models\Accounting\Invoice::TYPE_ACCREC
          node: Invoice.TypeEnum.ACCREC
          ruby: XeroRuby::Accounting::Invoice::ACCREC
          python_string: ACCREC
          java: com.xero.models.accounting.Invoice.TypeEnum.ACCREC
          csharp: Invoice.TypeEnum.ACCREC
          object: invoice
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: invoice
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: invoice
        - dueDate:
          is_variable: true
          nonString: true
          key: dueDate
          keyPascal: Date
          keySnake: due_date
          default: dueDateValue
          python: due_date_value
          ruby: due_date_value
          object: invoice
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: invoice
        - reference:
          key: reference
          keyPascal: Reference
          default: Website Design
          object: invoice
        - status:
          is_last: true
          nonString: true
          key: status
          keyPascal: Status
          default: DRAFT
          php: XeroAPI\XeroPHP\Models\Accounting\Invoice::STATUS_DRAFT
          node: Invoice.StatusEnum.DRAFT
          ruby: XeroRuby::Accounting::Invoice::DRAFT
          python_string: DRAFT
          java: com.xero.models.accounting.Invoice.StatusEnum.DRAFT
          csharp: Invoice.StatusEnum.DRAFT
          object: invoice
        - invoices:
          is_object: true
          key: invoices
          keyPascal: Invoices
        - add_invoice:
          is_last: true
          is_array_add: true
          key: invoices
          keyPascal: Invoices
          java: Invoices
          csharp: Invoice
          object: invoice
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Invoices array with newly created Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invoices'
              example:
                Id: ccece84a-075c-4fcd-9073-149d4f7a91cf
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552327126164)/
                Invoices:
                  - Type: ACCREC
                    InvoiceID: ed255415-e141-4150-aab7-89c3bbbb851c
                    InvoiceNumber: INV-0007
                    Reference: Website Design
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 40.00
                    AmountPaid: 0.00
                    SentToContact: false
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons:
                        - FirstName: Debbie
                          LastName: Gwyther
                          EmailAddress: debbie@rockstar.com
                          IncludeInEmails: false
                      HasValidationErrors: false
                    DateString: 2019-03-11T00:00:00
                    Date: /Date(1552262400000+0000)/
                    DueDateString: 2018-12-10T00:00:00
                    DueDate: /Date(1544400000000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Acme Tires
                        UnitAmount: 20.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 40.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 2.0000
                        LineItemID: 5f7a612b-fdcc-4d33-90fa-a9f6bc6db32f
                        ValidationErrors: []
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    UpdatedDateUTC: /Date(1552327126117+0000)/
                    CurrencyCode: NZD
                    StatusAttributeString: OK
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Invoices'
            example:
              Invoices:
                - Type: ACCREC
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                  LineItems:
                    - Description: Acme Tires
                      Quantity: 2
                      UnitAmount: 20
                      AccountCode: "200"
                      TaxType: NONE
                      LineAmount: 40
                  Date: "2019-03-11"
                  DueDate: "2018-12-10"
                  Reference: Website Design
                  Status: AUTHORISED
  /Invoices/{InvoiceID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getInvoice
      summary: Retrieves a specific sales invoice or purchase bill using a unique invoice Id
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Invoices array with specified Invoices
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invoices'
              example:
                Id: 516f400a-b764-4c88-831b-12d2b210fa24
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1551981658323)/
                Invoices:
                  - Type: ACCREC
                    InvoiceID: a03ffcd2-5d91-4c7e-b483-318584e9e439
                    InvoiceNumber: INV-0006
                    Reference: Tour
                    Payments:
                      - PaymentID: 38928000-e9a0-420c-8884-f624bab2a351
                        Date: /Date(1552953600000+0000)/
                        Amount: 148062.76
                        Reference: Yahoo
                        CurrencyRate: 1.000000
                        HasAccount: false
                        HasValidationErrors: false
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 0.00
                    AmountPaid: 148062.76
                    SentToContact: false
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 3a2fe7e0-fac7-4ea2-afb2-31cedaabd294
                        FileName: helo-heros.jpg
                        Url: https://api.xero.com/api.xro/2.0/Invoices/a03ffcd2-5d91-4c7e-b483-318584e9e439/Attachments/helo-heros.jpg
                        MimeType: image/jpeg
                        ContentLength: 2878711
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons:
                        - FirstName: Debbie
                          LastName: Gwyther
                          EmailAddress: debbie@rockstar.com
                          IncludeInEmails: false
                      HasValidationErrors: false
                    DateString: 2019-03-07T00:00:00
                    Date: /Date(1551916800000+0000)/
                    DueDateString: 2019-03-13T00:00:00
                    DueDate: /Date(1552435200000+0000)/
                    Status: PAID
                    LineAmountTypes: Exclusive
                    LineItems:
                      - ItemCode: "123"
                        Description: Guitars Fender Strat
                        UnitAmount: 148062.76
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 148062.76
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: b18f39d9-7739-4246-9288-72afe939d2d5
                        ValidationErrors: []
                    SubTotal: 148062.76
                    TotalTax: 0.00
                    Total: 148062.76
                    UpdatedDateUTC: /Date(1551981568133+0000)/
                    CurrencyCode: NZD
                    FullyPaidOnDate: /Date(1552953600000+0000)/
                    StatusAttributeString: ERROR
                    ValidationErrors:
                      - Message: 'Invoice # must be unique.'
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateInvoice
      summary: Updates a specific sales invoices or purchase bills
      x-hasAccountingValidationError: true
      x-example:
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - reference:
          is_last: true
          key: reference
          keyPascal: Reference
          default: I am Iron man
          object: invoice
        - invoices:
          is_object: true
          key: invoices
          keyPascal: Invoices
        - add_invoice:
          is_last: true
          is_array_add: true
          key: invoices
          keyPascal: Invoices
          java: Invoices
          csharp: Invoice
          object: invoice
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Invoices array with updated Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invoices'
              example:
                Id: bd83b60e-9d16-4a3b-9f59-0a2d0ccd35f2
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552329729002)/
                Invoices:
                  - Type: ACCREC
                    InvoiceID: 4074292c-09b3-456d-84e7-add864c6c39b
                    InvoiceNumber: INV-0008
                    Reference: My the Force be With You
                    Prepayments: []
                    Overpayments: []
                    AmountDue: 575.00
                    AmountPaid: 0.00
                    SentToContact: false
                    CurrencyRate: 1.000000
                    HasErrors: false
                    IsDiscounted: false
                    Contact:
                      ContactID: be392c72-c121-4f83-9512-03ac71e54c20
                      ContactStatus: ACTIVE
                      Name: Luke Skywalker
                      EmailAddress: ""
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1552329691573+0000)/
                      ContactGroups: []
                      IsSupplier: false
                      IsCustomer: true
                      DefaultCurrency: NZD
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-11T00:00:00
                    Date: /Date(1552262400000+0000)/
                    DueDateString: 2019-03-12T00:00:00
                    DueDate: /Date(1552348800000+0000)/
                    Status: SUBMITTED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Light Saber
                        UnitAmount: 500.00
                        TaxType: OUTPUT2
                        TaxAmount: 75.00
                        LineAmount: 500.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 6de1bf9f-de95-4c47-9287-37305db758c9
                        ValidationErrors: []
                    SubTotal: 500.00
                    TotalTax: 75.00
                    Total: 575.00
                    UpdatedDateUTC: /Date(1552329728987+0000)/
                    CurrencyCode: NZD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Invoices'
            example:
              Invoices:
                - Reference: May the force be with you
                  InvoiceID: 00000000-0000-0000-0000-000000000000
                  LineItems: []
                  Contact: {}
                  Type: ACCPAY
  /Invoices/{InvoiceID}/pdf:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getInvoiceAsPdf
      x-path: /Invoices/{InvoiceID}
      summary: Retrieves invoices or purchase bills as PDF files
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "200":
          description: Success - return response of byte array pdf version of specified Invoices
          content:
            application/pdf:
              schema:
                type: string
                format: binary
  /Invoices/{InvoiceID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getInvoiceAttachments
      summary: Retrieves attachments for a specific invoice or purchase bill
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachments for specified Invoices
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 7e357a45-69f5-4e8f-8d7b-15da8ef50aab
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552330258523)/
                Attachments:
                  - AttachmentID: 9808ad7f-c8d4-41cf-995e-bc29cb76fd2c
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/Invoices/4074292c-09b3-456d-84e7-add864c6c39b/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
                  - AttachmentID: 5a500c1a-5a02-48de-939e-1d234fd170d4
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Invoices/4074292c-09b3-456d-84e7-add864c6c39b/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /Invoices/{InvoiceID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getInvoiceAttachmentById
      summary: Retrieves a specific attachment from a specific invoices or purchase bills by using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Invoice as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /Invoices/{InvoiceID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getInvoiceAttachmentByFileName
      summary: Retrieves an attachment from a specific invoice or purchase bill by filename
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Invoice as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateInvoiceAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates an attachment from a specific invoices or purchase bill by filename
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with updated Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: acd7d618-5fef-4d45-849c-a339ea31a973
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552330524005)/
                Attachments:
                  - AttachmentID: 08085449-fda3-45f4-a685-ff44c8a29ee3
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/Invoices/4074292c-09b3-456d-84e7-add864c6c39b/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createInvoiceAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment for a specific invoice or purchase bill by filename
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/includeOnline'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Attachments array with newly created Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 971fbd18-c850-453a-825f-63f2fee096ee
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552330001318)/
                Attachments:
                  - AttachmentID: 5a500c1a-5a02-48de-939e-1d234fd170d4
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Invoices/4074292c-09b3-456d-84e7-add864c6c39b/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /Invoices/{InvoiceID}/OnlineInvoice:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getOnlineInvoice
      summary: Retrieves a URL to an online invoice
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "200":
          description: Success - return response of type OnlineInvoice array with one OnlineInvoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OnlineInvoices'
              example:
                Id: d20705fb-fe1c-4366-835b-98de7474da3c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552331100745)/
                OnlineInvoices:
                  - OnlineInvoiceUrl: https://in.xero.com/bCWCCfytGdTXoJam9HENWlQt07G6zcDaj4gQojHu
  /Invoices/{InvoiceID}/Email:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: emailInvoice
      summary: Sends a copy of a specific invoice to related contact via email
      x-hasAccountingValidationError: true
      x-example:
        - requestEmpty:
          is_last: true
          is_object: true
          key: requestEmpty
          keyPascal: RequestEmpty
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "204":
          description: Success - return response 204 no content
          x-isEmpty: true
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RequestEmpty'
            example: {}
  /Invoices/{InvoiceID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getInvoiceHistory
      summary: Retrieves history records for a specific invoice
      parameters:
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createInvoiceHistory
      summary: Creates a history record for a specific invoice
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/InvoiceID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /InvoiceReminders/Settings:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getInvoiceReminders
      summary: Retrieves invoice reminder settings
      responses:
        "200":
          description: Success - return response of Invoice Reminders
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InvoiceReminders'
              example:
                Id: c7cd0953-c012-4be8-b618-63ce4c2c3494
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552331430618)/
                InvoiceReminders:
                  - Enabled: false
  /Items:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getItems
      summary: Retrieves items
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: IsSold==true
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Code ASC
          schema:
            type: string
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Items array with all Item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Items'
              example:
                Id: 8487e8d7-5fb3-4f02-b949-dec8f1e38182
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552331874897)/
                Items:
                  - ItemID: c8c54d65-f3f2-452d-926e-bf450b12fb07
                    Code: "123"
                    Description: Guitars Fender Strat
                    UpdatedDateUTC: /Date(1551981476267+0000)/
                    PurchaseDetails: {}
                    SalesDetails:
                      UnitPrice: 5000.0000
                      AccountCode: "200"
                      TaxType: OUTPUT2
                    Name: Guitars
                    IsTrackedAsInventory: false
                    IsSold: true
                    IsPurchased: false
                  - ItemID: a4544d51-48f6-441f-a623-99ecbced6ab7
                    Code: abc65591
                    Description: Barfoo
                    UpdatedDateUTC: /Date(1552331873580+0000)/
                    PurchaseDetails: {}
                    SalesDetails: {}
                    Name: Hello11350
                    IsTrackedAsInventory: false
                    IsSold: true
                    IsPurchased: true
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createItems
      summary: Creates one or more items
      x-hasAccountingValidationError: true
      x-example:
        - purchaseDetails:
          is_object: true
          key: purchaseDetails
          keyPascal: Purchase
          keySnake: purchase_details
        - cOGSAccountCode:
          is_last: true
          key: cOGSAccountCode
          keyPascal: CoGSAccountCode
          keySnake: cogs_account_code
          keyCsharp: COGSAccountCode
          default: 500
          object: purchaseDetails
        - item:
          is_object: true
          key: item
          keyPascal: Item
        - code:
          key: code
          keyPascal: Code
          default: abcXYZ123
          object: item
        - name:
          key: name
          keyPascal: Name
          default: HelloWorld
          object: item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: item
        - inventoryAssetAccountCode:
          key: inventoryAssetAccountCode
          keyPascal: InventoryAssetAccountCode
          keySnake: inventory_asset_account_code
          default: 140
          object: item
        - set_purchaseDetails:
          is_last: true
          is_variable: true
          nonString: true
          key: purchaseDetails
          keyPascal: PurchaseDetails
          keySnake: purchase_details
          default: purchaseDetails
          python: purchase_details
          ruby: purchase_details
          object: item
        - items:
          is_object: true
          key: items
          keyPascal: Items
        - add_item:
          is_last: true
          is_array_add: true
          key: items
          keyPascal: Items
          java: Items
          csharp: Item
          object: item
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Items array with newly created Item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Items'
              example:
                Id: ae7ef7c8-9024-4d42-8d59-5f26ed3f508b
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552331871904)/
                Items:
                  - ItemID: a4544d51-48f6-441f-a623-99ecbced6ab7
                    Code: abc65591
                    Description: foobar
                    UpdatedDateUTC: /Date(1552331871707)/
                    PurchaseDetails: {}
                    SalesDetails: {}
                    Name: Hello11350
                    IsTrackedAsInventory: false
                    IsSold: true
                    IsPurchased: true
                    ValidationErrors:
                      - Message: Price List Item with Code ''abc'' already exists
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Items with an array of Item objects in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Items'
            example:
              Items:
                - Code: code123
                  Name: Item Name XYZ
                  Description: Foobar
                  InventoryAssetAccountCode: "140"
                  PurchaseDetails:
                    COGSAccountCode: "500"
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateOrCreateItems
      summary: Updates or creates one or more items
      x-hasAccountingValidationError: true
      x-example:
        - item:
          is_object: true
          key: item
          keyPascal: Item
        - code:
          key: code
          keyPascal: Code
          default: abcXYZ123
          object: item
        - name:
          key: name
          keyPascal: Name
          default: HelloWorld
          object: item
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Foobar
          object: item
        - items:
          is_object: true
          key: items
          keyPascal: Items
        - add_item:
          is_last: true
          is_array_add: true
          key: items
          keyPascal: Items
          java: Items
          csharp: Item
          object: item
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Items array with newly created Item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Items'
              example:
                Id: ae7ef7c8-9024-4d42-8d59-5f26ed3f508b
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552331871904)/
                Items:
                  - ItemID: a4544d51-48f6-441f-a623-99ecbced6ab7
                    Code: abc65591
                    Description: foobar
                    UpdatedDateUTC: /Date(1552331871707)/
                    PurchaseDetails: {}
                    SalesDetails: {}
                    Name: Hello11350
                    IsTrackedAsInventory: false
                    IsSold: true
                    IsPurchased: true
                    ValidationErrors:
                      - Message: Price List Item with Code ''abc'' already exists
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Items'
            example:
              Items:
                - Code: ItemCode123
                  Name: ItemName XYZ
                  Description: Item Description ABC
  /Items/{ItemID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getItem
      summary: Retrieves a specific item using a unique item Id
      parameters:
        - $ref: '#/components/parameters/ItemID'
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Items array with specified Item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Items'
              example:
                Id: 0bbd8a92-9ba7-4711-8040-8d6a609ca7e8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552333420160)/
                Items:
                  - ItemID: c8c54d65-f3f2-452d-926e-bf450b12fb07
                    Code: "123"
                    Description: Guitars Fender Strat
                    PurchaseDescription: Brand new Fender Strats
                    UpdatedDateUTC: /Date(1552333309387+0000)/
                    PurchaseDetails:
                      UnitPrice: 2500.0000
                      COGSAccountCode: "310"
                      TaxType: INPUT2
                    SalesDetails:
                      UnitPrice: 5000.0000
                      AccountCode: "200"
                      TaxType: OUTPUT2
                    Name: Guitars
                    IsTrackedAsInventory: true
                    InventoryAssetAccountCode: "630"
                    TotalCostPool: 25000.00
                    QuantityOnHand: 10.0000
                    IsSold: true
                    IsPurchased: true
                    ValidationErrors: []
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateItem
      summary: Updates a specific item
      x-hasAccountingValidationError: true
      x-example:
        - item:
          is_object: true
          key: item
          keyPascal: Item
        - code:
          key: code
          keyPascal: Code
          default: ItemCode123
          object: item
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Goodbye
          object: item
        - items:
          is_object: true
          key: items
          keyPascal: Items
        - add_item:
          is_last: true
          is_array_add: true
          key: items
          keyPascal: Items
          java: Items
          csharp: Item
          object: item
      parameters:
        - $ref: '#/components/parameters/ItemID'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Items array with updated Item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Items'
              example:
                Id: 24feb629-6b14-499e-9aa1-fc2c596c0280
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552332558975)/
                Items:
                  - ItemID: a7e87086-e0ae-4df2-83d7-e26e9a6b7786
                    Code: abc38306
                    Description: Hello Xero
                    UpdatedDateUTC: /Date(1552332558924)/
                    PurchaseDetails: {}
                    SalesDetails: {}
                    Name: Hello8746
                    IsTrackedAsInventory: false
                    IsSold: true
                    IsPurchased: true
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Items'
            example:
              Items:
                - Code: ItemCode123
                  Description: Description 123
    delete:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: deleteItem
      summary: Deletes a specific item
      parameters:
        - $ref: '#/components/parameters/ItemID'
      responses:
        "204":
          description: Success - return response 204 no content
          x-isEmpty: true
        "400":
          $ref: '#/components/responses/400Error'
  /Items/{ItemID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getItemHistory
      summary: Retrieves history for a specific item
      parameters:
        - $ref: '#/components/parameters/ItemID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createItemHistory
      summary: Creates a history record for a specific item
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ItemID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Journals:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.journals.read
      tags:
        - Accounting
      operationId: getJournals
      summary: Retrieves journals
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: offset
          description: Offset by a specified journal number. e.g. journals with a JournalNumber greater than the offset will be returned
          example: 10
          schema:
            type: integer
        - in: query
          name: paymentsOnly
          x-snake: payments_only
          description: Filter to retrieve journals on a cash basis. Journals are returned on an accrual basis by default.
          example: true
          x-example-python: "True"
          schema:
            type: boolean
      responses:
        "200":
          description: Success - return response of type Journals array with all Journals
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Journals'
              example:
                Id: 49a09a97-df50-4679-8043-02c86e0dcf5f
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552335214210)/
                Journals:
                  - JournalID: 1b31feeb-aa23-404c-8c19-24c827c53661
                    JournalDate: /Date(1539993600000+0000)/
                    JournalNumber: 1
                    CreatedDateUTC: /Date(1541176243467+0000)/
                    Reference: Red Fish, Blue Fish
                    SourceID: d4956132-ed94-4dd7-9eaa-aa22dfdf06f2
                    SourceType: ACCREC
                    JournalLines:
                      - JournalLineID: 81e6b1bf-d812-4f87-8dc4-698558ae043e
                        AccountID: b94495d0-44ab-4199-a1d0-427a4877e100
                        AccountCode: "610"
                        AccountType: CURRENT
                        AccountName: Accounts Receivable
                        Description: ""
                        NetAmount: 40.00
                        GrossAmount: 40.00
                        TaxAmount: 0.00
                        TrackingCategories: []
                      - JournalLineID: ad221a8c-ebee-4c1b-88ed-d574e27e8803
                        AccountID: e0a5d892-9f9f-44f0-a153-5cb7db125170
                        AccountCode: "200"
                        AccountType: REVENUE
                        AccountName: Sales
                        Description: Acme Tires
                        NetAmount: -40.00
                        GrossAmount: -40.00
                        TaxAmount: 0.00
                        TaxType: NONE
                        TaxName: No GST
                        TrackingCategories: []
                  - JournalID: 2be66e45-805b-46de-921d-c67e1d3dad2a
                    JournalDate: /Date(1539993600000+0000)/
                    JournalNumber: 9
                    CreatedDateUTC: /Date(1541176504083+0000)/
                    Reference: Red Fish, Blue Fish
                    SourceID: 046d8a6d-1ae1-4b4d-9340-5601bdf41b87
                    SourceType: ACCREC
                    JournalLines:
                      - JournalLineID: ba8a5680-a753-4a35-b3dd-0bc72e5c26a1
                        AccountID: b94495d0-44ab-4199-a1d0-427a4877e100
                        AccountCode: "610"
                        AccountType: CURRENT
                        AccountName: Accounts Receivable
                        Description: ""
                        NetAmount: 40.00
                        GrossAmount: 40.00
                        TaxAmount: 0.00
                        TrackingCategories: []
                      - JournalLineID: 09a0b9b9-0222-4e24-8c31-efef472e22f1
                        AccountID: e0a5d892-9f9f-44f0-a153-5cb7db125170
                        AccountCode: "200"
                        AccountType: REVENUE
                        AccountName: Sales
                        Description: Acme Tires
                        NetAmount: -40.00
                        GrossAmount: -40.00
                        TaxAmount: 0.00
                        TaxType: NONE
                        TaxName: No GST
                        TrackingCategories: []
                  - JournalID: d0ed2957-ebba-4d3a-8367-ae9ccd574885
                    JournalDate: /Date(1543449600000+0000)/
                    JournalNumber: 14
                    CreatedDateUTC: /Date(1541176592673+0000)/
                    SourceID: 99ea7f6b-c513-4066-bc27-b7c65dcd76c2
                    SourceType: ACCRECPAYMENT
                    JournalLines:
                      - JournalLineID: 1bdae2b7-3035-40ec-b344-b12b1c23adc4
                        AccountID: b94495d0-44ab-4199-a1d0-427a4877e100
                        AccountCode: "610"
                        AccountType: CURRENT
                        AccountName: Accounts Receivable
                        Description: ""
                        NetAmount: -46.00
                        GrossAmount: -46.00
                        TaxAmount: 0.00
                        TrackingCategories: []
                      - JournalLineID: 353be85e-ae79-4bb3-9483-5ea7682fc0a3
                        AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                        AccountCode: "970"
                        AccountType: EQUITY
                        AccountName: Owner A Funds Introduced
                        Description: ""
                        NetAmount: 46.00
                        GrossAmount: 46.00
                        TaxAmount: 0.00
                        TrackingCategories: []
                  - JournalID: 772e8133-7f12-4edc-ab98-aa6dceb16c9d
                    JournalDate: /Date(1552262400000+0000)/
                    JournalNumber: 30
                    CreatedDateUTC: /Date(1552333389227+0000)/
                    Reference: ""
                    SourceID: 5376633d-0456-43a3-8234-e457a3f50a12
                    SourceType: ACCPAY
                    JournalLines:
                      - JournalLineID: 33469836-642f-4973-a708-0e99339dff4a
                        AccountID: a2a4795b-a01f-40eb-afa6-a34b4514875d
                        AccountCode: "800"
                        AccountType: CURRLIAB
                        AccountName: Accounts Payable
                        Description: ""
                        NetAmount: -28750.00
                        GrossAmount: -28750.00
                        TaxAmount: 0.00
                        TrackingCategories: []
                      - JournalLineID: 4f3b6462-5cf6-4b55-a2ae-de4039878215
                        AccountID: 53a12a15-7e9b-4a31-85f4-a7cee6d04215
                        AccountCode: "630"
                        AccountType: CURRENT
                        AccountName: Inventory
                        Description: Brand new Fender Strats
                        NetAmount: 25000.00
                        GrossAmount: 28750.00
                        TaxAmount: 3750.00
                        TaxType: INPUT2
                        TaxName: 15% GST on Expenses
                        TrackingCategories: []
                      - JournalLineID: 534e822e-d441-48a7-8e57-5ad54729e83e
                        AccountID: 17d9a4a0-3181-4803-a96b-f0dbe589091b
                        AccountCode: "820"
                        AccountType: CURRLIAB
                        AccountName: GST
                        Description: ""
                        NetAmount: 3750.00
                        GrossAmount: 3750.00
                        TaxAmount: 0.00
                        TrackingCategories: []
  /Journals/{JournalID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.journals.read
      tags:
        - Accounting
      operationId: getJournal
      summary: Retrieves a specific journal using a unique journal Id.
      parameters:
        - $ref: '#/components/parameters/JournalID'
      responses:
        "200":
          description: Success - return response of type Journals array with specified Journal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Journals'
              example:
                Id: 39ab8367-eb14-420d-83a9-e01ddddd21f8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552335613002)/
                Journals:
                  - JournalID: 1b31feeb-aa23-404c-8c19-24c827c53661
                    JournalDate: /Date(1539993600000+0000)/
                    JournalNumber: 1
                    CreatedDateUTC: /Date(1541176243467+0000)/
                    Reference: Red Fish, Blue Fish
                    JournalLines:
                      - JournalLineID: 81e6b1bf-d812-4f87-8dc4-698558ae043e
                        AccountID: b94495d0-44ab-4199-a1d0-427a4877e100
                        AccountCode: "610"
                        AccountType: CURRENT
                        AccountName: Accounts Receivable
                        Description: ""
                        NetAmount: 40.00
                        GrossAmount: 40.00
                        TaxAmount: 0.00
                        TaxType: ""
                        TaxName: ""
                        TrackingCategories: []
                      - JournalLineID: ad221a8c-ebee-4c1b-88ed-d574e27e8803
                        AccountID: e0a5d892-9f9f-44f0-a153-5cb7db125170
                        AccountCode: "200"
                        AccountType: REVENUE
                        AccountName: Sales
                        Description: Acme Tires
                        NetAmount: -40.00
                        GrossAmount: -40.00
                        TaxAmount: 0.00
                        TaxType: NONE
                        TaxName: No GST
                        TrackingCategories: []
  /Journals/{JournalNumber}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.journals.read
      tags:
        - Accounting
      operationId: getJournalByNumber
      summary: Retrieves a specific journal using a unique journal number.
      parameters:
        - $ref: '#/components/parameters/JournalNumber'
      responses:
        "200":
          description: Success - return response of type Journals array with specified Journal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Journals'
              example:
                Id: 39ab8367-eb14-420d-83a9-e01ddddd21f8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552335613002)/
                Journals:
                  - JournalID: 1b31feeb-aa23-404c-8c19-24c827c53661
                    JournalDate: /Date(1539993600000+0000)/
                    JournalNumber: 1
                    CreatedDateUTC: /Date(1541176243467+0000)/
                    Reference: Red Fish, Blue Fish
                    JournalLines:
                      - JournalLineID: 81e6b1bf-d812-4f87-8dc4-698558ae043e
                        AccountID: b94495d0-44ab-4199-a1d0-427a4877e100
                        AccountCode: "610"
                        AccountType: CURRENT
                        AccountName: Accounts Receivable
                        Description: ""
                        NetAmount: 40.00
                        GrossAmount: 40.00
                        TaxAmount: 0.00
                        TaxType: ""
                        TaxName: ""
                        TrackingCategories: []
                      - JournalLineID: ad221a8c-ebee-4c1b-88ed-d574e27e8803
                        AccountID: e0a5d892-9f9f-44f0-a153-5cb7db125170
                        AccountCode: "200"
                        AccountType: REVENUE
                        AccountName: Sales
                        Description: Acme Tires
                        NetAmount: -40.00
                        GrossAmount: -40.00
                        TaxAmount: 0.00
                        TaxType: NONE
                        TaxName: No GST
                        TrackingCategories: []
  /LinkedTransactions:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getLinkedTransactions
      summary: Retrieves linked transactions (billable expenses)
      parameters:
        - in: query
          name: page
          description: Up to 100 linked transactions will be returned in a single API call. Use the page parameter to specify the page to be returned e.g. page=1.
          example: 1
          schema:
            type: integer
        - in: query
          name: LinkedTransactionID
          x-snake: linked_transaction_id
          description: The Xero identifier for an Linked Transaction
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: SourceTransactionID
          x-snake: source_transaction_id
          description: Filter by the SourceTransactionID. Get the linked transactions created from a particular ACCPAY invoice
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: ContactID
          x-snake: contact_id
          description: Filter by the ContactID. Get all the linked transactions that have been assigned to a particular customer.
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: Status
          x-snake: status
          description: Filter by the combination of ContactID and Status. Get  the linked transactions associated to a  customer and with a status
          example: APPROVED
          schema:
            type: string
        - in: query
          name: TargetTransactionID
          x-snake: target_transaction_id
          description: Filter by the TargetTransactionID. Get all the linked transactions allocated to a particular ACCREC invoice
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: Success - return response of type LinkedTransactions array with all LinkedTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LinkedTransactions'
              example:
                Id: 516aabd0-e670-48d5-b0eb-10dce4494dd8
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552348338096)/
                LinkedTransactions:
                  - LinkedTransactionID: 5cf7d9c0-b9a7-4433-a2dc-ae3c11bba39b
                    SourceTransactionID: aec416dd-38ea-40dc-9f0b-813c8c71f87f
                    SourceLineItemID: 77e0b23b-5b79-4f4b-ae20-c9031d41442f
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                    TargetTransactionID: 83693fc1-5b05-4807-b190-109d4a85dd5f
                    TargetLineItemID: d5128ff1-0f39-4d2a-a6d5-46dfaf5f075c
                    Status: ONDRAFT
                    Type: BILLABLEEXPENSE
                    UpdatedDateUTC: /Date(1552347991000+0000)/
                    SourceTransactionTypeCode: ACCPAY
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createLinkedTransaction
      summary: Creates linked transactions (billable expenses)
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - linkedTransaction:
          is_object: true
          key: linkedTransaction
          keyPascal: LinkedTransaction
          keySnake: linked_transaction
        - sourceTransactionID:
          is_uuid: true
          key: sourceTransactionID
          keyPascal: SourceTransactionID
          keySnake: source_transaction_id
          default: 00000000-0000-0000-0000-000000000000
          object: linkedTransaction
        - sourceLineItemID:
          is_last: true
          is_uuid: true
          key: sourceLineItemID
          keyPascal: SourceLineItemID
          keySnake: source_line_item_id
          default: 00000000-0000-0000-0000-000000000000
          object: linkedTransaction
      responses:
        "200":
          description: Success - return response of type LinkedTransactions array with newly created LinkedTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LinkedTransactions'
              example:
                Id: f32b30e5-32d1-42a8-bcc9-5b22828f725c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552351054646)/
                LinkedTransactions:
                  - LinkedTransactionID: e9684b6c-4df9-45a0-917b-85cc29857008
                    SourceTransactionID: a848644a-f20f-4630-98c3-386bd7505631
                    SourceLineItemID: b0df260d-3cc8-4ced-9bd6-41924f624ed3
                    Status: DRAFT
                    Type: BILLABLEEXPENSE
                    UpdatedDateUTC: /Date(1552351055000+0000)/
                    SourceTransactionTypeCode: ACCPAY
                    ValidationErrors:
                      - Message: The SourceLineItemID and SourceTransactionID do not match
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: LinkedTransaction object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LinkedTransaction'
            example:
              LinkedTransactions:
                - SourceTransactionID: a848644a-f20f-4630-98c3-386bd7505631
                  SourceLineItemID: b0df260d-3cc8-4ced-9bd6-41924f624ed3
  /LinkedTransactions/{LinkedTransactionID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getLinkedTransaction
      summary: Retrieves a specific linked transaction (billable expenses) using a unique linked transaction Id
      parameters:
        - $ref: '#/components/parameters/LinkedTransactionID'
      responses:
        "200":
          description: Success - return response of type LinkedTransactions array with a specified LinkedTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LinkedTransactions'
              example:
                Id: 171ca542-874d-44e2-8930-db9bccd7d88b
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552348339875)/
                LinkedTransactions:
                  - LinkedTransactionID: 5cf7d9c0-b9a7-4433-a2dc-ae3c11bba39b
                    SourceTransactionID: aec416dd-38ea-40dc-9f0b-813c8c71f87f
                    SourceLineItemID: 77e0b23b-5b79-4f4b-ae20-c9031d41442f
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                    TargetTransactionID: 83693fc1-5b05-4807-b190-109d4a85dd5f
                    TargetLineItemID: d5128ff1-0f39-4d2a-a6d5-46dfaf5f075c
                    Status: ONDRAFT
                    Type: BILLABLEEXPENSE
                    UpdatedDateUTC: /Date(1552347991000+0000)/
                    SourceTransactionTypeCode: ACCPAY
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateLinkedTransaction
      summary: Updates a specific linked transactions (billable expenses)
      x-hasAccountingValidationError: true
      x-example:
        - linkedTransaction:
          is_object: true
          key: linkedTransaction
          keyPascal: LinkedTransaction
          keySnake: linked_transaction
        - sourceLineItemID:
          is_uuid: true
          key: sourceLineItemID
          keyPascal: SourceLineItemID
          keySnake: source_line_item_id
          default: 00000000-0000-0000-0000-000000000000
          object: linkedTransaction
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          default: 00000000-0000-0000-0000-000000000000
          object: linkedTransaction
        - linkedTransactions:
          is_object: true
          key: linkedTransactions
          keyPascal: LinkedTransactions
        - add_linkedTransaction:
          is_last: true
          is_array_add: true
          key: linkedTransactions
          keyPascal: LinkedTransactions
          keySnake: linked_transactions
          java: LinkedTransactions
          python: linked_transaction
          ruby: linked_transaction
          csharp: LinkedTransaction
          object: linkedTransaction
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/LinkedTransactionID'
      responses:
        "200":
          description: Success - return response of type LinkedTransactions array with updated LinkedTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LinkedTransactions'
              example:
                Id: bd364af7-08f0-432b-81db-c1e5ba05f3dd
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552351488159)/
                LinkedTransactions:
                  - LinkedTransactionID: e9684b6c-4df9-45a0-917b-85cc29857008
                    SourceTransactionID: a848644a-f20f-4630-98c3-386bd7505631
                    SourceLineItemID: b0df260d-3cc8-4ced-9bd6-41924f624ed3
                    ContactID: 4e1753b9-018a-4775-b6aa-1bc7871cfee3
                    Status: DRAFT
                    Type: BILLABLEEXPENSE
                    UpdatedDateUTC: /Date(1552351055000+0000)/
                    SourceTransactionTypeCode: ACCPAY
        "400":
          description: Success - return response of type LinkedTransactions array with updated LinkedTransaction
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - LinkedTransactionID: 5a68b5b4-8cf0-4af5-8c3c-513cc19e1c73
                    SourceTransactionID: aec416dd-38ea-40dc-9f0b-813c8c71f87f
                    SourceLineItemID: 77e0b23b-5b79-4f4b-ae20-c9031d41442f
                    ContactID: 4e1753b9-018a-4775-b6aa-1bc7871cfee3
                    TargetTransactionID: 83693fc1-5b05-4807-b190-109d4a85dd5f
                    TargetLineItemID: d5128ff1-0f39-4d2a-a6d5-46dfaf5f075c
                    Status: ONDRAFT
                    Type: BILLABLEEXPENSE
                    UpdatedDateUTC: /Date(1552349706000+0000)/
                    SourceTransactionTypeCode: ACCPAY
                    ValidationErrors:
                      - Message: The ContactID and the TargetTransaction ContactID do not match
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LinkedTransactions'
            example:
              LinkedTransactions:
                - SourceTransactionID: 00000000-0000-0000-0000-000000000000
                  SourceLineItemID: 00000000-0000-0000-0000-000000000000
    delete:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deleteLinkedTransaction
      summary: Deletes a specific linked transactions (billable expenses)
      parameters:
        - $ref: '#/components/parameters/LinkedTransactionID'
      responses:
        "204":
          description: Success - return response 204 no content
          x-isEmpty: true
        "400":
          $ref: '#/components/responses/400Error'
  /ManualJournals:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getManualJournals
      summary: Retrieves manual journals
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="DRAFT"
          x-example-csharp: Status==\"DRAFT\"
          x-example-java: Status==&quot;&apos; + ManualJournal.StatusEnum.DRAFT + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\ManualJournal::STATUS_DRAFT . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::ManualJournal::DRAFT}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Date ASC
          schema:
            type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 manual journals will be returned in a single API call with line items shown for each overpayment
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type ManualJournals array with a all ManualJournals
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ManualJournals'
              example:
                Id: 8a508ec1-b578-48bf-97df-020c918fbf7d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552357217359)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 3
                ManualJournals:
                  - Date: /Date(1553126400000+0000)/
                    Status: POSTED
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552357188083+0000)/
                    ManualJournalID: 0b159335-606b-485f-b51b-97b3b32bad32
                    Narration: 'Reversal: These aren''''t the droids you are looking for'
                    JournalLines: []
                    ShowOnCashBasisReports: true
                    HasAttachments: false
                  - Date: /Date(1552348800000+0000)/
                    Status: POSTED
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552357188147+0000)/
                    ManualJournalID: 99cb8353-ce73-4a5d-8e0d-8b0edf86cfc4
                    Narration: These aren''t the droids you are looking for
                    JournalLines: []
                    ShowOnCashBasisReports: true
                    HasAttachments: true
                  - Date: /Date(1552262400000+0000)/
                    Status: DRAFT
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552357216843+0000)/
                    ManualJournalID: ecb6b362-c78f-462a-a229-a66abf115e92
                    Narration: Foo bar
                    JournalLines: []
                    ShowOnCashBasisReports: true
                    HasAttachments: false
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createManualJournals
      summary: Creates one or more manual journals
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.of(2020, Month.OCTOBER, 10)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2019-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - manualJournalLines:
          is_list: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
        - credit:
          is_object: true
          key: credit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: -100.0
          is_money: true
          object: credit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 400
          object: credit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: credit
        - add_credit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: credit
        - debit:
          is_object: true
          key: debit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: 100.0
          is_money: true
          object: debit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 120
          object: debit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: debit
        - add_debit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: debit
        - manualJournal:
          is_object: true
          key: manualJournal
          keyPascal: ManualJournal
          keySnake: manual_journal
        - narration:
          key: narration
          keyPascal: Narration
          default: Foobar
          object: manualJournal
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: manualJournal
        - set_manualJournalLines:
          is_last: true
          is_variable: true
          nonString: true
          key: journalLines
          keyPascal: JournalLines
          keySnake: journal_lines
          default: manualJournalLines
          python: manual_journal_lines
          ruby: manual_journal_lines
          object: manualJournal
        - manualJournals:
          is_object: true
          key: manualJournals
          keyPascal: ManualJournals
        - add_manualJournal:
          is_last: true
          is_array_add: true
          key: manualJournals
          keyPascal: ManualJournals
          keySnake: manual_journals
          java: ManualJournals
          php: manualJournals
          python: manual_journal
          ruby: manual_journal
          csharp: ManualJournal
          object: manualJournal
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type ManualJournals array with newly created ManualJournal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ManualJournals'
              example:
                Id: 45dfa608-0fcb-4f30-a377-c82cd348569c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552595972952)/
                ManualJournals:
                  - Date: /Date(1552521600000+0000)/
                    Status: DRAFT
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552595972920+0000)/
                    ManualJournalID: d312dd5e-a53e-46d1-9d51-c569ef4570b7
                    Narration: Foo bar
                    JournalLines:
                      - Description: Hello there
                        TaxType: NONE
                        LineAmount: 100.00
                        AccountCode: "400"
                        Tracking: []
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                      - Description: Goodbye
                        TaxType: NONE
                        LineAmount: -100.00
                        AccountCode: "400"
                        Tracking:
                          - Name: Simpsons
                            Option: Bart
                            TrackingCategoryID: 6a68adde-f210-4465-b0a9-0d8cc6f50762
                            TrackingOptionID: dc54c220-0140-495a-b925-3246adc0075f
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                    ShowOnCashBasisReports: true
                    Warnings:
                      - Message: Account code ''476'' has been removed as it does not match a recognised account.
                    ValidationErrors:
                      - Message: The total debits (100.00) must equal total credits (-10.00)
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: ManualJournals array with ManualJournal object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ManualJournals'
            example:
              ManualJournals:
                - Narration: Journal Desc
                  JournalLines:
                    - LineAmount: 100
                      AccountCode: "400"
                      Description: Money Movement
                    - LineAmount: -100
                      AccountCode: "400"
                      Description: Prepayment of things
                      Tracking:
                        - Name: North
                          Option: Region
                  Date: "2019-03-14"
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateManualJournals
      summary: Updates or creates a single manual journal
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.of(2020, Month.OCTOBER, 10)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - manualJournalLines:
          is_list: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
        - credit:
          is_object: true
          key: credit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: -100.0
          is_money: true
          object: credit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 400
          object: credit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: credit
        - add_credit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: credit
        - debit:
          is_object: true
          key: debit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: 100.0
          is_money: true
          object: debit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 120
          object: debit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: debit
        - add_debit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: debit
        - manualJournal:
          is_object: true
          key: manualJournal
          keyPascal: ManualJournal
          keySnake: manual_journal
        - narration:
          key: narration
          keyPascal: Narration
          default: Foobar
          object: manualJournal
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: manualJournal
        - set_manualJournalLines:
          is_last: true
          is_variable: true
          nonString: true
          key: manualJournalLines
          keyPascal: JournalLines
          keySnake: journal_lines
          default: manualJournalLines
          python: manual_journal_lines
          ruby: manual_journal_lines
          object: manualJournal
        - manualJournals:
          is_object: true
          key: manualJournals
          keyPascal: ManualJournals
        - add_manualJournal:
          is_last: true
          is_array_add: true
          key: manualJournals
          keyPascal: ManualJournals
          keySnake: manual_journals
          java: ManualJournals
          php: manualJournals
          python: manual_journal
          ruby: manual_journal
          csharp: ManualJournal
          object: manualJournal
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type ManualJournals array with newly created ManualJournal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ManualJournals'
              example:
                Id: 45dfa608-0fcb-4f30-a377-c82cd348569c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552595972952)/
                ManualJournals:
                  - Date: /Date(1552521600000+0000)/
                    Status: DRAFT
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552595972920+0000)/
                    ManualJournalID: d312dd5e-a53e-46d1-9d51-c569ef4570b7
                    Narration: Foo bar
                    JournalLines:
                      - Description: Hello there
                        TaxType: NONE
                        LineAmount: 100.00
                        AccountCode: "400"
                        Tracking: []
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                      - Description: Goodbye
                        TaxType: NONE
                        LineAmount: -100.00
                        AccountCode: "400"
                        Tracking:
                          - Name: Simpsons
                            Option: Bart
                            TrackingCategoryID: 6a68adde-f210-4465-b0a9-0d8cc6f50762
                            TrackingOptionID: dc54c220-0140-495a-b925-3246adc0075f
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                    ShowOnCashBasisReports: true
                    Warnings:
                      - Message: Account code ''476'' has been removed as it does not match a recognised account.
                    ValidationErrors:
                      - Message: The total debits (100.00) must equal total credits (-10.00)
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: ManualJournals array with ManualJournal object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ManualJournals'
            example:
              ManualJournals:
                - Narration: Journal Desc
                  JournalLines:
                    - LineAmount: 100
                      AccountCode: "400"
                      Description: Money Movement
                    - LineAmount: -100
                      AccountCode: "400"
                      Description: Prepayment of things
                      Tracking:
                        - Name: North
                          Option: Region
                  Date: "2019-03-14"
  /ManualJournals/{ManualJournalID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getManualJournal
      summary: Retrieves a specific manual journal
      parameters:
        - $ref: '#/components/parameters/ManualJournalID'
      responses:
        "200":
          description: Success - return response of type ManualJournals array with a specified ManualJournals
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ManualJournals'
              example:
                Id: 7321fc21-1a13-4f40-ae47-df59cff5676d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552399859139)/
                ManualJournals:
                  - Date: /Date(1552348800000+0000)/
                    Status: POSTED
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552357188147+0000)/
                    ManualJournalID: 99cb8353-ce73-4a5d-8e0d-8b0edf86cfc4
                    Narration: These aren''t the droids you are looking for
                    JournalLines:
                      - Description: These aren''t the droids you are looking for
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 100.00
                        AccountCode: "429"
                        Tracking: []
                        AccountID: 160bad11-c1b7-4c7e-8903-dca925d78721
                        IsBlank: false
                      - Description: Yes the are
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: -100.00
                        AccountCode: "200"
                        Tracking: []
                        AccountID: e0a5d892-9f9f-44f0-a153-5cb7db125170
                        IsBlank: false
                    ShowOnCashBasisReports: true
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 166ca8f8-8bc6-4780-8466-a0e474d586ea
                        FileName: giphy.gif
                        Url: https://api.xero.com/api.xro/2.0/manualjournal/99cb8353-ce73-4a5d-8e0d-8b0edf86cfc4/Attachments/giphy.gif
                        MimeType: image/gif
                        ContentLength: 495727
                      - AttachmentID: 5e5036f9-b1e0-4c5d-a93f-61900137e40b
                        FileName: ridehistory.pdf
                        Url: https://api.xero.com/api.xro/2.0/manualjournal/99cb8353-ce73-4a5d-8e0d-8b0edf86cfc4/Attachments/ridehistory.pdf
                        MimeType: application/pdf
                        ContentLength: 4423
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateManualJournal
      summary: Updates a specific manual journal
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.of(2020, Month.OCTOBER, 10)
          csharp: new DateTime(2020, 10, 10)
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - manualJournalLines:
          is_list: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
        - credit:
          is_object: true
          key: credit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: -100.0
          is_money: true
          object: credit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 400
          object: credit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: credit
        - add_credit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: credit
        - debit:
          is_object: true
          key: debit
          keyPascal: ManualJournalLine
        - lineAmount:
          nonString: true
          key: lineAmount
          keyPascal: LineAmount
          keySnake: line_amount
          default: 100.0
          is_money: true
          object: debit
        - accountCode:
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: 120
          object: debit
        - description:
          is_last: true
          key: description
          keyPascal: Description
          default: Hello there
          object: debit
        - add_debit:
          is_last: true
          is_list_add: true
          key: manualJournalLines
          keyPascal: ManualJournalLine
          keySnake: manual_journal_lines
          object: debit
        - manualJournal:
          is_object: true
          key: manualJournal
          keyPascal: ManualJournal
          keySnake: manual_journal
        - narration:
          key: narration
          keyPascal: Narration
          default: Foobar
          object: manualJournal
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: manualJournal
        - set_manualJournalLines:
          is_last: true
          is_variable: true
          nonString: true
          key: manualJournalLines
          keyPascal: JournalLines
          keySnake: journal_lines
          default: manualJournalLines
          python: manual_journal_lines
          ruby: manual_journal_lines
          object: manualJournal
        - manualJournals:
          is_object: true
          key: manualJournals
          keyPascal: ManualJournals
        - add_manualJournal:
          is_last: true
          is_array_add: true
          key: manualJournals
          keyPascal: ManualJournals
          keySnake: manual_journals
          java: ManualJournals
          php: manualJournals
          python: manual_journal
          ruby: manual_journal
          csharp: ManualJournal
          object: manualJournal
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ManualJournalID'
      responses:
        "200":
          description: Success - return response of type ManualJournals array with an updated ManualJournal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ManualJournals'
              example:
                Id: b694559c-686c-4047-b657-661ba6c0dd1f
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552357736850)/
                ManualJournals:
                  - Date: /Date(1552262400000+0000)/
                    Status: DRAFT
                    LineAmountTypes: NoTax
                    UpdatedDateUTC: /Date(1552357736820+0000)/
                    ManualJournalID: 07eac261-78ef-47a0-a0eb-a57b74137877
                    Narration: Hello Xero
                    JournalLines:
                      - Description: Hello there
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 100.00
                        AccountCode: "400"
                        Tracking: []
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                      - Description: Goodbye
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: -100.00
                        AccountCode: "400"
                        Tracking: []
                        AccountID: c4f29c22-28c2-4a13-9eab-ecbbd641ffdf
                        IsBlank: false
                    ShowOnCashBasisReports: true
                    HasAttachments: false
                    Attachments: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ManualJournals'
            example:
              ManualJournals:
                - Narration: Hello Xero
                  ManualJournalID: 00000000-0000-0000-0000-000000000000
                  JournalLines: []
  /ManualJournals/{ManualJournalID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getManualJournalAttachments
      summary: Retrieves attachment for a specific manual journal
      parameters:
        - $ref: '#/components/parameters/ManualJournalID'
      responses:
        "200":
          description: Success - return response of type Attachments array with all Attachments for a ManualJournals
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 5fa4b3ef-7945-45a7-9bab-10e830673dfb
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552404121471)/
                Attachments:
                  - AttachmentID: 16e86f32-3e25-4209-8662-c0dfd91b654c
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/ManualJournals/0b159335-606b-485f-b51b-97b3b32bad32/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
                  - AttachmentID: ff7c439e-a057-4807-ac2c-b558d7df7511
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/ManualJournals/0b159335-606b-485f-b51b-97b3b32bad32/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /ManualJournals/{ManualJournalID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getManualJournalAttachmentById
      summary: Allows you to retrieve a specific attachment from a specific manual journal using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/ManualJournalID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Manual Journal as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /ManualJournals/{ManualJournalID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getManualJournalAttachmentByFileName
      summary: Retrieves a specific attachment from a specific manual journal by file name
      parameters:
        - $ref: '#/components/parameters/ManualJournalID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Manual Journal as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateManualJournalAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment from a specific manual journal by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ManualJournalID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with an update Attachment for a ManualJournals
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: e1cb9deb-a8f0-477f-b4d1-cf0c6c39e080
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552401039306)/
                Attachments:
                  - AttachmentID: 16e86f32-3e25-4209-8662-c0dfd91b654c
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/ManualJournals/0b159335-606b-485f-b51b-97b3b32bad32/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createManualJournalAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates a specific attachment for a specific manual journal by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ManualJournalID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with a newly created Attachment for a ManualJournals
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: a864994c-e7d7-4dee-b5ca-0a729fde2f39
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552400898428)/
                Attachments:
                  - AttachmentID: 47ac97ff-d4f9-48a0-8a8e-49fae29129e7
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/ManualJournals/0b159335-606b-485f-b51b-97b3b32bad32/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /ManualJournals/{ManualJournalID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getManualJournalsHistory
      summary: Retrieves history for a specific manual journal
      parameters:
        - $ref: '#/components/parameters/ManualJournalID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createManualJournalHistoryRecord
      summary: Creates a history record for a specific manual journal
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ManualJournalID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Organisation:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getOrganisations
      summary: Retrieves Xero organisation details
      responses:
        "200":
          description: Success - return response of type Organisation array with all Organisation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Organisations'
              example:
                Id: 27b7a645-a3ee-43c8-b2c6-a2fa7b84c8c5
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552404447003)/
                Organisations:
                  - APIKey: CTJ60UH519MXQIXEJSDPDALS3EOZ5Y
                    Name: Dev Evangelist - Sid Test 3 (NZ-2016-02)
                    LegalName: Dev Evangelist - Sid Test 3 (NZ-2016-02)
                    PaysTax: true
                    Version: NZ
                    OrganisationType: COMPANY
                    BaseCurrency: NZD
                    CountryCode: NZ
                    IsDemoCompany: false
                    OrganisationStatus: ACTIVE
                    TaxNumber: 071-138-054
                    FinancialYearEndDay: 31
                    FinancialYearEndMonth: 3
                    SalesTaxBasis: PAYMENTS
                    SalesTaxPeriod: TWOMONTHS
                    DefaultSalesTax: Tax Exclusive
                    DefaultPurchasesTax: Tax Exclusive
                    PeriodLockDate: /Date(1546214400000+0000)/
                    EndOfYearLockDate: /Date(1546214400000+0000)/
                    CreatedDateUTC: /Date(1455827393000)/
                    OrganisationEntityType: COMPANY
                    Timezone: NEWZEALANDSTANDARDTIME
                    ShortCode: '!mBdtL'
                    OrganisationID: b2c885a9-4bb9-4a00-9b6e-6c2bf60b1a2b
                    Edition: BUSINESS
                    Class: PREMIUM
                    Addresses: []
                    Phones: []
                    ExternalLinks: []
                    PaymentTerms: {}
  /Organisation/Actions:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getOrganisationActions
      summary: Retrieves a list of the key actions your app has permission to perform in the connected Xero organisation.
      responses:
        "200":
          description: Success - return response of type Actions array with all key actions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Actions'
              example:
                Id: f02c0dd1-1917-4d57-9853-997f6bcaf2bc
                Status: OK
                ProviderName: Java OA2 dev 01
                DateTimeUTC: /Date(1602883301013)/
                Actions:
                  - Name: CreateApprovedInvoice
                    Status: ALLOWED
                  - Name: CreateDraftPurchaseOrder
                    Status: ALLOWED
                  - Name: CreateApprovedBill
                    Status: ALLOWED
                  - Name: AttachFilesIntoInvoice
                    Status: ALLOWED
                  - Name: UseMulticurrency
                    Status: ALLOWED
                  - Name: CreateDraftInvoice
                    Status: ALLOWED
                  - Name: CreateRepeatingInvoice
                    Status: ALLOWED
                  - Name: CreateRepeatingBill
                    Status: ALLOWED
                  - Name: CreateSentQuote
                    Status: ALLOWED
                  - Name: CreateInvoicePayment
                    Status: ALLOWED
                  - Name: CreateApprovedPurchaseOrder
                    Status: ALLOWED
                  - Name: CreateDraftQuote
                    Status: ALLOWED
                  - Name: CreateDraftBill
                    Status: ALLOWED
  /Organisation/{OrganisationID}/CISSettings:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getOrganisationCISSettings
      summary: Retrieves the CIS settings for the Xero organistaion.
      parameters:
        - $ref: '#/components/parameters/OrganisationID'
      responses:
        "200":
          description: Success - return response of type Organisation array with specified Organisation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CISOrgSettings'
              example:
                CISSettings:
                  - CISEnambed: true
                    Rate: 10
  /Overpayments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getOverpayments
      summary: Retrieves overpayments
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="AUTHORISED"
          x-example-csharp: Status==\"AUTHORISED\"
          x-example-java: Status==&quot;&apos; + Overpayment.StatusEnum.AUTHORISED + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Overpayment::STATUS_AUTHORISED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Overpayment::AUTHORISED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Status ASC
          schema:
            type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 overpayments will be returned in a single API call with line items shown for each overpayment
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type Overpayments array with all Overpayments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Overpayments'
              example:
                Id: c0ce675e-e5bc-4b2a-a20e-76a9eaedf89d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552428951416)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 5
                Overpayments:
                  - OverpaymentID: 098b4dcb-5622-4699-87f8-9d40c4ccceb3
                    ID: 098b4dcb-5622-4699-87f8-9d40c4ccceb3
                    Type: SPEND-OVERPAYMENT
                    RemainingCredit: 500.00
                    Allocations: []
                    Payments: []
                    HasAttachments: false
                    Contact:
                      ContactID: af3ffcc1-c578-4658-82f3-5d8d458cc7af
                      Name: Daddy Warbucks
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-12T00:00:00
                    Date: /Date(1552348800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 500.00
                    TotalTax: 0.00
                    Total: 500.00
                    UpdatedDateUTC: /Date(1552428535123+0000)/
                    CurrencyCode: NZD
                  - OverpaymentID: 2a8bda49-8908-473b-8bcf-1f90990460eb
                    ID: 2a8bda49-8908-473b-8bcf-1f90990460eb
                    Type: RECEIVE-OVERPAYMENT
                    RemainingCredit: 20.00
                    Allocations: []
                    Payments: []
                    HasAttachments: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1552428568250+0000)/
                    CurrencyCode: NZD
                  - OverpaymentID: ed7f6041-c915-4667-bd1d-54c48e92161e
                    ID: ed7f6041-c915-4667-bd1d-54c48e92161e
                    Type: SPEND-OVERPAYMENT
                    RemainingCredit: 3000.00
                    Allocations: []
                    Payments: []
                    HasAttachments: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-12T00:00:00
                    Date: /Date(1552348800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 3000.00
                    TotalTax: 0.00
                    Total: 3000.00
                    UpdatedDateUTC: /Date(1552428781527+0000)/
                    CurrencyCode: NZD
                  - OverpaymentID: 0859adbc-ea00-40cd-a877-258cf8644975
                    ID: 0859adbc-ea00-40cd-a877-258cf8644975
                    Type: RECEIVE-OVERPAYMENT
                    RemainingCredit: 20.00
                    Allocations: []
                    Payments: []
                    HasAttachments: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1552428842190+0000)/
                    CurrencyCode: NZD
                  - OverpaymentID: 687b877f-634a-415d-92b2-74e62977de30
                    ID: 687b877f-634a-415d-92b2-74e62977de30
                    Type: RECEIVE-OVERPAYMENT
                    RemainingCredit: 20.00
                    Allocations: []
                    Payments: []
                    HasAttachments: false
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1552428950730+0000)/
                    CurrencyCode: NZD
  /Overpayments/{OverpaymentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getOverpayment
      summary: Retrieves a specific overpayment using a unique overpayment Id
      parameters:
        - $ref: '#/components/parameters/OverpaymentID'
      responses:
        "200":
          description: Success - return response of type Overpayments array with specified Overpayments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Overpayments'
              example:
                Id: 46c9e8e2-9410-4e75-9297-f0ca8fa76c32
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553278835158)/
                Overpayments:
                  - OverpaymentID: ed7f6041-c915-4667-bd1d-54c48e92161e
                    ID: ed7f6041-c915-4667-bd1d-54c48e92161e
                    CurrencyRate: 1.000000
                    Type: SPEND-OVERPAYMENT
                    RemainingCredit: 2999.00
                    Allocations:
                      - Amount: 1.00
                        Date: /Date(1552348800000+0000)/
                        Invoice:
                          InvoiceID: c45720a1-ade3-4a38-a064-d15489be6841
                          InvoiceNumber: ""
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                    Payments: []
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 247dd942-5245-47a7-adb1-4d9ea075b431
                        FileName: giphy.gif
                        Url: https://api.xero.com/api.xro/2.0/banktransaction/ed7f6041-c915-4667-bd1d-54c48e92161e/Attachments/giphy.gif
                        MimeType: image/gif
                        ContentLength: 495727
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-12T00:00:00
                    Date: /Date(1552348800000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: NoTax
                    LineItems:
                      - Description: Broken TV deposit
                        UnitAmount: 3000.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 3000.00
                        AccountCode: "800"
                        Tracking: []
                        Quantity: 1.0000
                        DiscountEnteredAsPercent: true
                        ValidationErrors: []
                    SubTotal: 3000.00
                    TotalTax: 0.00
                    Total: 3000.00
                    UpdatedDateUTC: /Date(1552428952890+0000)/
                    CurrencyCode: NZD
  /Overpayments/{OverpaymentID}/Allocations:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createOverpaymentAllocations
      summary: Creates a single allocation for a specific overpayment
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          keySnake: invoice_id
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - allocation:
          is_object: true
          key: allocation
          keyPascal: Allocation
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          object: allocation
        - date:
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: allocation
        - set_invoice:
          is_last: true
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: allocation
        - allocations:
          is_object: true
          key: allocations
          keyPascal: Allocations
        - add_allocation:
          is_last: true
          is_array_add: true
          key: allocations
          keyPascal: Allocations
          java: Allocations
          csharp: Allocation
          object: allocation
      parameters:
        - $ref: '#/components/parameters/OverpaymentID'
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Allocations array with all Allocation for Overpayments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocations'
              example:
                Id: 3b7f7be2-384a-4703-bcfb-c56e9116c914
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552428952968)/
                Allocations:
                  - Amount: 1.00
                    Date: /Date(1552348800000+0000)/
                    Invoice:
                      InvoiceID: c45720a1-ade3-4a38-a064-d15489be6841
                      Payments: []
                      CreditNotes: []
                      Prepayments: []
                      Overpayments: []
                      HasErrors: false
                      IsDiscounted: false
                      LineItems: []
                      ValidationErrors: []
                    Overpayment:
                      OverpaymentID: ed7f6041-c915-4667-bd1d-54c48e92161e
                      ID: ed7f6041-c915-4667-bd1d-54c48e92161e
                      LineItems: []
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Allocations array with Allocation object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Allocations'
            example:
              Allocations:
                - Invoice:
                    InvoiceID: 00000000-0000-0000-0000-000000000000
                    LineItems: []
                    Contact: {}
                    Type: ACCPAY
                  Amount: 10.00
                  Date: "2019-03-12"
  /Overpayments/{OverpaymentID}/Allocations/{AllocationID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    delete:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deleteOverpaymentAllocations
      summary: Deletes an Allocation from an overpayment
      parameters:
        - $ref: '#/components/parameters/OverpaymentID'
        - $ref: '#/components/parameters/AllocationID'
      responses:
        "200":
          description: Success - return response of type Allocation with the isDeleted flag as true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocation'
              example:
                AllocationId: 2bb15054-3868-4f85-a9c6-0402ec8c1201
                Date: /Date(1551822670731)/
                Invoice:
                  - InvoiceID: b7eb1fc9-a0f9-4e8e-9373-6689f5350832
                IsDeleted: true
  /Overpayments/{OverpaymentID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getOverpaymentHistory
      summary: Retrieves history records of a specific overpayment
      parameters:
        - $ref: '#/components/parameters/OverpaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createOverpaymentHistory
      summary: Creates a history record for a specific overpayment
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/OverpaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          description: A failed request due to validation error - API is not able to create HistoryRecord for Overpayments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - DateUTCString: 2019-03-12T22:30:13
                    DateUTC: /Date(1552429813667)/
                    Details: Hello World
                    ValidationErrors:
                      - Message: The document with the supplied id was not found for this endpoint.
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Payments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPayments
      summary: Retrieves payments for invoices and credit notes
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="AUTHORISED"
          x-example-csharp: Status==\"AUTHORISED\"
          x-example-java: Status==&quot;&apos; + Payment.StatusEnum.AUTHORISED + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Payment::STATUS_AUTHORISED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Payment::AUTHORISED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Amount ASC
          schema:
            type: string
        - in: query
          name: page
          description: Up to 100 payments will be returned in a single API call
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type Payments array for all Payments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payments'
              example:
                Id: 9f310473-e1b5-4704-a25c-eec653deb596
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552431874205)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 2
                Payments:
                  - PaymentID: 99ea7f6b-c513-4066-bc27-b7c65dcd76c2
                    BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                    BatchPayment:
                      Account:
                        AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                      Date: /Date(1552521600000+0000)/
                      Type: RECBATCH
                      Status: AUTHORISED
                      TotalAmount: "50.00"
                      UpdatedDateUTC: /Date(1541176592690+0000)/
                      IsReconciled: "false"
                    Date: /Date(1543449600000+0000)/
                    BankAmount: 46.00
                    Amount: 46.00
                    Reference: ""
                    CurrencyRate: 1.000000
                    PaymentType: ACCRECPAYMENT
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1541176592690+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      Code: "970"
                    Invoice:
                      Type: ACCREC
                      InvoiceID: 046d8a6d-1ae1-4b4d-9340-5601bdf41b87
                      InvoiceNumber: INV-0002
                      Payments: []
                      CreditNotes: []
                      Prepayments: []
                      Overpayments: []
                      HasErrors: false
                      IsDiscounted: false
                      Contact:
                        ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                        ContactNumber: ""
                        Name: Barney Rubble-83203
                        Addresses: []
                        Phones: []
                        ContactGroups: []
                        ContactPersons: []
                        HasValidationErrors: false
                      LineItems: []
                      CurrencyCode: NZD
                    HasValidationErrors: false
                  - PaymentID: 6b037c9b-2e5d-4905-84d3-eabfb3438242
                    Date: /Date(1552521600000+0000)/
                    BankAmount: 2.00
                    Amount: 2.00
                    Reference: Too much
                    CurrencyRate: 1.000000
                    PaymentType: ARCREDITPAYMENT
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1551812346173+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 136ebd08-60ea-4592-8982-be92c153b53a
                      Code: "980"
                    Invoice:
                      Type: ACCRECCREDIT
                      InvoiceID: 249f15fa-f2a7-4acc-8769-0984103f2225
                      InvoiceNumber: CN-0005
                      Payments: []
                      CreditNotes: []
                      Prepayments: []
                      Overpayments: []
                      HasErrors: false
                      IsDiscounted: false
                      Contact:
                        ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                        ContactNumber: ""
                        Name: Liam Gallagher
                        Addresses: []
                        Phones: []
                        ContactGroups: []
                        ContactPersons: []
                        HasValidationErrors: false
                      LineItems: []
                      CurrencyCode: NZD
                    HasValidationErrors: false
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPayments
      summary: Creates multiple payments for invoices or credit notes
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-10-10T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          keySnake: invoice_id
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - account:
          is_object: true
          key: account
          keyPascal: Account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: account
        - payment:
          is_object: true
          key: payment
          keyPascal: Payment
        - set_invoice:
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: payment
        - set_account:
          is_variable: true
          nonString: true
          key: account
          keyPascal: Account
          default: account
          object: payment
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          object: payment
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: payment
        - payments:
          is_object: true
          key: payments
          keyPascal: Payments
        - add_payment:
          is_last: true
          is_array_add: true
          key: payments
          keyPascal: Payments
          java: Payments
          csharp: Payment
          object: payment
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Payments array for newly created Payment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payments'
              example:
                Id: 83b5715a-6a77-4c16-b5b8-2da08b5fde44
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552432238716)/
                Payments:
                  - PaymentID: 61ed71fc-01bf-4eb8-8419-8a18789ff45f
                    Date: /Date(1552348800000+0000)/
                    BankAmount: 1.00
                    Amount: 1.00
                    CurrencyRate: 1.000000
                    PaymentType: ACCRECPAYMENT
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1552432238623+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      Code: "970"
                      Name: Owner A Funds Introduced
                    Invoice:
                      Type: ACCREC
                      InvoiceID: c7c37b83-ac95-45ea-88ba-8ad83a5f22fe
                      InvoiceNumber: INV-0004
                      Reference: ""
                      Prepayments: []
                      Overpayments: []
                      AmountDue: 229.00
                      AmountPaid: 1.00
                      SentToContact: false
                      CurrencyRate: 1.000000
                      HasErrors: false
                      IsDiscounted: false
                      Contact:
                        ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                        Name: Barney Rubble-83203
                        ContactPersons: []
                        HasValidationErrors: false
                      DateString: 2018-10-10T00:00:00
                      Date: /Date(1539129600000+0000)/
                      DueDateString: 2018-10-18T00:00:00
                      DueDate: /Date(1539820800000+0000)/
                      Status: AUTHORISED
                      LineAmountTypes: Exclusive
                      LineItems:
                        - Description: boo
                          UnitAmount: 200.00
                          TaxType: OUTPUT2
                          TaxAmount: 30.00
                          LineAmount: 200.00
                          AccountCode: "200"
                          Tracking: []
                          Quantity: 1.0000
                          LineItemID: 173dfdb9-43b5-4bd2-ae25-9419e662a3a7
                          ValidationErrors: []
                      SubTotal: 200.00
                      TotalTax: 30.00
                      Total: 230.00
                      UpdatedDateUTC: /Date(1552432238623+0000)/
                      CurrencyCode: NZD
                    HasValidationErrors: true
                    ValidationErrors:
                      - Message: Payment amount exceeds the amount outstanding on this document
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Payments array with Payment object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Payments'
            example:
              Payments:
                - Invoice:
                    LineItems: []
                    InvoiceID: 00000000-0000-0000-0000-000000000000
                  Account:
                    Code: "970"
                  Date: "2019-03-12"
                  Amount: 1
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPayment
      summary: Creates a single payment for invoice or credit notes
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-10-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-10-10T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          keySnake: invoice_id
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - account:
          is_object: true
          key: account
          keyPascal: Account
        - accountID:
          is_last: true
          is_uuid: true
          key: accountID
          keyPascal: AccountID
          keySnake: account_id
          default: 00000000-0000-0000-0000-000000000000
          object: account
        - payment:
          is_object: true
          key: payment
          keyPascal: Payment
        - set_invoice:
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: payment
        - set_account:
          is_variable: true
          nonString: true
          key: account
          keyPascal: Account
          default: account
          object: payment
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          object: payment
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: payment
        - payments:
          is_object: true
          key: payments
          keyPascal: Payments
        - add_payment:
          is_last: true
          is_array_add: true
          key: payments
          keyPascal: Payments
          java: Payments
          csharp: Payment
          object: payment
      responses:
        "200":
          description: Success - return response of type Payments array for newly created Payment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payments'
              example:
                Id: 83b5715a-6a77-4c16-b5b8-2da08b5fde44
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552432238716)/
                Payments:
                  - PaymentID: 61ed71fc-01bf-4eb8-8419-8a18789ff45f
                    Date: /Date(1552348800000+0000)/
                    BankAmount: 1.00
                    Amount: 1.00
                    CurrencyRate: 1.000000
                    PaymentType: ACCRECPAYMENT
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1552432238623+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      Code: "970"
                      Name: Owner A Funds Introduced
                    Invoice:
                      Type: ACCREC
                      InvoiceID: c7c37b83-ac95-45ea-88ba-8ad83a5f22fe
                      InvoiceNumber: INV-0004
                      Reference: ""
                      Prepayments: []
                      Overpayments: []
                      AmountDue: 229.00
                      AmountPaid: 1.00
                      SentToContact: false
                      CurrencyRate: 1.000000
                      HasErrors: false
                      IsDiscounted: false
                      Contact:
                        ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                        Name: Barney Rubble-83203
                        ContactPersons: []
                        HasValidationErrors: false
                      DateString: 2018-10-10T00:00:00
                      Date: /Date(1539129600000+0000)/
                      DueDateString: 2018-10-18T00:00:00
                      DueDate: /Date(1539820800000+0000)/
                      Status: AUTHORISED
                      LineAmountTypes: Exclusive
                      LineItems:
                        - Description: boo
                          UnitAmount: 200.00
                          TaxType: OUTPUT2
                          TaxAmount: 30.00
                          LineAmount: 200.00
                          AccountCode: "200"
                          Tracking: []
                          Quantity: 1.0000
                          LineItemID: 173dfdb9-43b5-4bd2-ae25-9419e662a3a7
                          ValidationErrors: []
                      SubTotal: 200.00
                      TotalTax: 30.00
                      Total: 230.00
                      UpdatedDateUTC: /Date(1552432238623+0000)/
                      CurrencyCode: NZD
                    HasValidationErrors: true
                    ValidationErrors:
                      - Message: Payment amount exceeds the amount outstanding on this document
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Request body with a single Payment object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Payment'
            example:
              Payments:
                - Invoice:
                    LineItems: []
                    InvoiceID: 00000000-0000-0000-0000-000000000000
                  Account:
                    Code: "970"
                  Date: "2019-03-12"
                  Amount: 1
  /Payments/{PaymentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPayment
      summary: Retrieves a specific payment for invoices and credit notes using a unique payment Id
      parameters:
        - $ref: '#/components/parameters/PaymentID'
      responses:
        "200":
          description: Success - return response of type Payments array for specified Payment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payments'
              example:
                Id: 4876f9ee-3a17-47d8-8c1b-84377c8f2998
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552431874852)/
                Payments:
                  - PaymentID: 99ea7f6b-c513-4066-bc27-b7c65dcd76c2
                    BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                    BatchPayment:
                      Account:
                        AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      BatchPaymentID: b54aa50c-794c-461b-89d1-846e1b84d9c0
                      Date: /Date(1543449600000+0000)/
                      Type: RECBATCH
                      Status: AUTHORISED
                      TotalAmount: "50.00"
                      UpdatedDateUTC: /Date(1541176592690+0000)/
                      IsReconciled: "false"
                    Date: /Date(1543449600000+0000)/
                    BankAmount: 46.00
                    Amount: 46.00
                    CurrencyRate: 1.000000
                    PaymentType: ACCRECPAYMENT
                    Status: AUTHORISED
                    UpdatedDateUTC: /Date(1541176592690+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                      Code: "970"
                      Name: Owner A Funds Introduced
                    Invoice:
                      Type: ACCREC
                      InvoiceID: 046d8a6d-1ae1-4b4d-9340-5601bdf41b87
                      InvoiceNumber: INV-0002
                      Reference: Red Fish, Blue Fish
                      Payments:
                        - PaymentID: 99ea7f6b-c513-4066-bc27-b7c65dcd76c2
                          Date: /Date(1543449600000+0000)/
                          Amount: 46.00
                          CurrencyRate: 1.000000
                          HasAccount: false
                          HasValidationErrors: false
                      Prepayments: []
                      Overpayments: []
                      AmountDue: 0.00
                      AmountPaid: 46.00
                      SentToContact: true
                      CurrencyRate: 1.000000
                      HasErrors: false
                      IsDiscounted: false
                      Contact:
                        ContactID: a3675fc4-f8dd-4f03-ba5b-f1870566bcd7
                        Name: Barney Rubble-83203
                        ContactPersons: []
                        HasValidationErrors: false
                      DateString: 2018-10-20T00:00:00
                      Date: /Date(1539993600000+0000)/
                      DueDateString: 2018-12-30T00:00:00
                      DueDate: /Date(1546128000000+0000)/
                      Status: PAID
                      LineAmountTypes: Exclusive
                      LineItems:
                        - Description: Acme Tires
                          UnitAmount: 20.00
                          TaxType: OUTPUT2
                          TaxAmount: 6.00
                          LineAmount: 40.00
                          AccountCode: "200"
                          Tracking: []
                          Quantity: 2.0000
                          LineItemID: 878d1688-a905-4866-ae91-5a772c2540c7
                          ValidationErrors: []
                      SubTotal: 40.00
                      TotalTax: 6.00
                      Total: 46.00
                      UpdatedDateUTC: /Date(1541176592690+0000)/
                      CurrencyCode: NZD
                      FullyPaidOnDate: /Date(1543449600000+0000)/
                    HasValidationErrors: false
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deletePayment
      summary: Updates a specific payment for invoices and credit notes
      x-hasAccountingValidationError: true
      x-example:
        - paymentDelete:
          is_object: true
          key: paymentDelete
          keyPascal: PaymentDelete
        - status:
          is_last: true
          key: status
          keyPascal: Status
          default: DELETED
          object: paymentDelete
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PaymentID'
      responses:
        "200":
          description: Success - return response of type Payments array for updated Payment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payments'
              example:
                Id: ee23328c-4a8b-4ee7-8fb6-9796ffab9cb0
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1583945852489)/
                Payments:
                  - PaymentID: c94c996b-1ab3-4ff3-ad19-1cdc77f30817
                    Date: /Date(1567382400000+0000)/
                    BankAmount: 2.00
                    Amount: 2.00
                    Reference: foobar
                    CurrencyRate: 1.000000
                    PaymentType: APCREDITPAYMENT
                    Status: DELETED
                    UpdatedDateUTC: /Date(1583945852373+0000)/
                    HasAccount: true
                    IsReconciled: false
                    Account:
                      AccountID: 57f261f0-e32d-4a7f-be82-22cd992c6367
                      Code: "033"
                      Name: Checking account
                    Invoice:
                      Type: ACCPAYCREDIT
                      InvoiceID: dba68ebc-c05a-4e2d-b97d-964349e5b8d6
                      InvoiceNumber: ""
                      Reference: ""
                      Prepayments: []
                      Overpayments: []
                      AmountDue: 22.00
                      AmountPaid: 0.00
                      SentToContact: false
                      CurrencyRate: 1.000000
                      IsDiscounted: false
                      HasErrors: false
                      Contact:
                        ContactID: 216830cb-9a68-487e-928b-c1a7ccc4fc81
                        Name: FooBar73005
                        ContactPersons: []
                        HasValidationErrors: false
                      DateString: 2017-01-02T00:00:00
                      Date: /Date(1483315200000+0000)/
                      Status: AUTHORISED
                      LineAmountTypes: Exclusive
                      LineItems:
                        - Description: Sample Item72716
                          UnitAmount: 20.00
                          TaxType: INPUT
                          TaxAmount: 2.00
                          LineAmount: 20.00
                          AccountCode: "400"
                          Tracking: []
                          Quantity: 1.0000
                          ValidationErrors: []
                      SubTotal: 20.00
                      TotalTax: 2.00
                      Total: 22.00
                      UpdatedDateUTC: /Date(1583945852363+0000)/
                      CurrencyCode: AUD
                    HasValidationErrors: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaymentDelete'
            example:
              Payments:
                - Status: DELETED
  /Payments/{PaymentID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPaymentHistory
      summary: Retrieves history records of a specific payment
      parameters:
        - $ref: '#/components/parameters/PaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPaymentHistory
      summary: Creates a history record for a specific payment
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          description: A failed request due to validation error - API is not able to create HistoryRecord for Payments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - DateUTCString: 2019-03-12T22:30:13
                    DateUTC: /Date(1552429813667)/
                    Details: Hello World
                    ValidationErrors:
                      - Message: The document with the supplied id was not found for this endpoint.
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /PaymentServices:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - paymentservices
      tags:
        - Accounting
      operationId: getPaymentServices
      summary: Retrieves payment services
      x-excludeFromPreview: true
      responses:
        "200":
          description: Success - return response of type PaymentServices array for all PaymentService
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentServices'
              example:
                Id: ab82a7dd-5070-4e82-b841-0af52909fe04
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552488713171)/
                PaymentServices:
                  - PaymentServiceID: 54b3b4f6-0443-4fba-bcd1-61ec0c35ca55
                    PaymentServiceName: PayUpNow
                    PaymentServiceUrl: https://www.payupnow.com/
                    PaymentServiceType: Custom
                    PayNowText: Time To Pay
    put:
      security:
        - OAuth2:
            - paymentservices
      tags:
        - Accounting
      operationId: createPaymentService
      summary: Creates a payment service
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-excludeFromPreview: true
      x-hasAccountingValidationError: true
      x-example:
        - object:
          is_object: true
          key: paymentService
          keyPascal: PaymentService
          keySnake: payment_service
        - paymentServiceName:
          key: paymentServiceName
          keyPascal: PaymentServiceName
          keySnake: payment_service_name
          default: ACME Payments
          object: paymentService
        - paymentServiceUrl:
          key: paymentServiceUrl
          keyPascal: PaymentServiceUrl
          keySnake: payment_service_url
          default: https://www.payupnow.com/
          object: paymentService
        - payNowText:
          is_last: true
          key: payNowText
          keyPascal: PayNowText
          keySnake: pay_now_text
          default: Pay Now
          object: paymentService
        - paymentServices:
          is_object: true
          key: paymentServices
          keyPascal: PaymentServices
        - add_paymentService:
          is_last: true
          is_array_add: true
          key: paymentServices
          keyPascal: PaymentServices
          java: PaymentServices
          csharp: PaymentService
          object: paymentService
      responses:
        "200":
          description: Success - return response of type PaymentServices array for newly created PaymentService
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentServices'
              example:
                Id: 7ed8b3c0-2155-49ee-a583-f2dce6607dfb
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552488712813)/
                PaymentServices:
                  - PaymentServiceID: 54b3b4f6-0443-4fba-bcd1-61ec0c35ca55
                    PaymentServiceName: PayUpNow
                    PaymentServiceUrl: https://www.payupnow.com/
                    PaymentServiceType: Custom
                    PayNowText: Time To Pay
                    ValidationErrors:
                      - Message: Payment service could not be found
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: PaymentServices array with PaymentService object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaymentServices'
            example:
              PaymentServices:
                - PaymentServiceName: PayUpNow
                  PaymentServiceUrl: https://www.payupnow.com/
                  PayNowText: Time To Pay
  /Prepayments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPrepayments
      summary: Retrieves prepayments
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="AUTHORISED"
          x-example-csharp: Status==\"AUTHORISED\"
          x-example-java: Status==&quot;&apos; + Prepayment.StatusEnum.AUTHORISED + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Prepayment::STATUS_AUTHORISED . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Prepayment::AUTHORISED}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Reference ASC
          schema:
            type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 prepayments will be returned in a single API call with line items shown for each overpayment
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type Prepayments array for all Prepayment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prepayments'
              example:
                Id: d7a9ca0c-6159-4c26-ad2e-715440c50b7d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552489227595)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 1
                Prepayments:
                  - PrepaymentID: ce0cddef-cf5a-4e59-b638-f225679115a7
                    ID: ce0cddef-cf5a-4e59-b638-f225679115a7
                    Type: RECEIVE-PREPAYMENT
                    Reference: INV-0011
                    RemainingCredit: 3450.00
                    Allocations: []
                    Payments: []
                    HasAttachments: true
                    Contact:
                      ContactID: be392c72-c121-4f83-9512-03ac71e54c20
                      Name: Luke Skywalker
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems: []
                    SubTotal: 3000.00
                    TotalTax: 450.00
                    Total: 3450.00
                    UpdatedDateUTC: /Date(1552489187730+0000)/
                    CurrencyCode: NZD
  /Prepayments/{PrepaymentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPrepayment
      summary: Allows you to retrieve a specified prepayments
      parameters:
        - $ref: '#/components/parameters/PrepaymentID'
      responses:
        "200":
          description: Success - return response of type Prepayments array for a specified Prepayment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prepayments'
              example:
                Id: 18e5f578-ef28-4096-a7aa-d06d65574b99
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553540376847)/
                Prepayments:
                  - PrepaymentID: ce0cddef-cf5a-4e59-b638-f225679115a7
                    ID: ce0cddef-cf5a-4e59-b638-f225679115a7
                    CurrencyRate: 1.000000
                    Type: RECEIVE-PREPAYMENT
                    Reference: INV-0011
                    RemainingCredit: 3449.00
                    Allocations:
                      - Amount: 1.00
                        Date: /Date(1552435200000+0000)/
                        Invoice:
                          InvoiceID: c7c37b83-ac95-45ea-88ba-8ad83a5f22fe
                          InvoiceNumber: INV-0004
                          Payments: []
                          CreditNotes: []
                          Prepayments: []
                          Overpayments: []
                          HasErrors: false
                          IsDiscounted: false
                          LineItems: []
                    Payments: []
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 2ca06aa0-3629-474a-9401-553d4b7fa9b0
                        FileName: giphy.gif
                        Url: https://api.xero.com/api.xro/2.0/banktransaction/ce0cddef-cf5a-4e59-b638-f225679115a7/Attachments/giphy.gif
                        MimeType: image/gif
                        ContentLength: 495727
                    Contact:
                      ContactID: be392c72-c121-4f83-9512-03ac71e54c20
                      ContactStatus: ACTIVE
                      Name: Luke Skywalker
                      EmailAddress: ""
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                        - AddressType: POBOX
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1552329691573+0000)/
                      ContactGroups: []
                      DefaultCurrency: NZD
                      ContactPersons: []
                      HasValidationErrors: false
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Light Speeder
                        UnitAmount: 3000.00
                        TaxType: OUTPUT2
                        TaxAmount: 450.00
                        LineAmount: 3000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        DiscountEnteredAsPercent: true
                        ValidationErrors: []
                    SubTotal: 3000.00
                    TotalTax: 450.00
                    Total: 3450.00
                    UpdatedDateUTC: /Date(1552522424850+0000)/
                    CurrencyCode: NZD
  /Prepayments/{PrepaymentID}/Allocations:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPrepaymentAllocations
      summary: Allows you to create an Allocation for prepayments
      x-hasAccountingValidationError: true
      x-example:
        - currDate:
          is_date: true
          key: currDate
          keyPascal: CurrDate
          keySnake: curr_date
          java_datatype: LocalDate
          default: LocalDate.now()
          java: LocalDate.now()
          csharp: DateTime.Now
          node: '''2020-12-10'''
          php: new DateTime('2020-12-10')
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - invoice:
          is_object: true
          key: invoice
          keyPascal: Invoice
        - invoiceID:
          is_last: true
          is_uuid: true
          key: invoiceID
          keyPascal: InvoiceID
          keySnake: invoice_id
          default: 00000000-0000-0000-0000-000000000000
          object: invoice
        - allocation:
          is_object: true
          key: allocation
          keyPascal: Allocation
        - set_invoice:
          is_variable: true
          nonString: true
          key: invoice
          keyPascal: Invoice
          default: invoice
          object: allocation
        - amount:
          nonString: true
          key: amount
          keyPascal: Amount
          default: 1.0
          is_money: true
          object: allocation
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: currDate
          python: curr_date
          ruby: curr_date
          object: allocation
        - allocations:
          is_object: true
          key: allocations
          keyPascal: Allocations
        - add_allocation:
          is_last: true
          is_array_add: true
          key: allocations
          keyPascal: Allocations
          java: Allocations
          csharp: Allocation
          object: allocation
      parameters:
        - $ref: '#/components/parameters/PrepaymentID'
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Allocations array of Allocation for all Prepayment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocations'
              example:
                Id: d4758808-d14d-45d5-851a-52787ae5739a
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552522424927)/
                Allocations:
                  - Amount: 1.00
                    Date: /Date(1552435200000+0000)/
                    Invoice:
                      InvoiceID: c7c37b83-ac95-45ea-88ba-8ad83a5f22fe
                      Payments: []
                      CreditNotes: []
                      Prepayments: []
                      Overpayments: []
                      HasErrors: false
                      IsDiscounted: false
                      LineItems: []
                      ValidationErrors: []
                    Prepayment:
                      PrepaymentID: ce0cddef-cf5a-4e59-b638-f225679115a7
                      ID: ce0cddef-cf5a-4e59-b638-f225679115a7
                      LineItems: []
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Allocations with an array of Allocation object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Allocations'
            example:
              Allocations:
                - Invoice:
                    LineItems: []
                    InvoiceID: 00000000-0000-0000-0000-000000000000
                  Amount: 1
                  Date: "2019-01-10"
  /Prepayments/{PrepaymentID}/Allocations/{AllocationID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    delete:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: deletePrepaymentAllocations
      summary: Deletes an Allocation from a Prepayment
      parameters:
        - $ref: '#/components/parameters/PrepaymentID'
        - $ref: '#/components/parameters/AllocationID'
      responses:
        "200":
          description: Success - return response of type Allocation with the isDeleted flag as true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Allocation'
              example:
                AllocationId: 2bb15054-3868-4f85-a9c6-0402ec8c1201
                Date: /Date(1551822670731)/
                Invoice:
                  - InvoiceID: b7eb1fc9-a0f9-4e8e-9373-6689f5350832
                IsDeleted: true
  /Prepayments/{PrepaymentID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPrepaymentHistory
      summary: Retrieves history record for a specific prepayment
      parameters:
        - $ref: '#/components/parameters/PrepaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPrepaymentHistory
      summary: Creates a history record for a specific prepayment
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PrepaymentID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          description: Unsupported - return response incorrect exception, API is not able to create HistoryRecord for Expense Claims
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example: ' { "ErrorNumber": 10, "Type": "ValidationException", "Message": "A validation exception occurred", "Elements": [ { "DateUTCString": "2019-03-14T00:15:35", "DateUTC": "/Date(1552522535440)/", "Details": "Hello World", "ValidationErrors": [ { "Message": "The document with the supplied id was not found for this endpoint." } ] } ] }'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /PurchaseOrders:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPurchaseOrders
      summary: Retrieves purchase orders
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: Status
          x-snake: status
          description: Filter by purchase order status
          example: SUBMITTED
          schema:
            type: string
            enum:
              - DRAFT
              - SUBMITTED
              - AUTHORISED
              - BILLED
              - DELETED
        - in: query
          name: DateFrom
          x-snake: date_from
          description: Filter by purchase order date (e.g. GET https://.../PurchaseOrders?DateFrom=2015-12-01&DateTo=2015-12-31
          example: "2019-12-01"
          schema:
            type: string
        - in: query
          name: DateTo
          x-snake: date_to
          description: Filter by purchase order date (e.g. GET https://.../PurchaseOrders?DateFrom=2015-12-01&DateTo=2015-12-31
          example: "2019-12-31"
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: PurchaseOrderNumber ASC
          schema:
            type: string
        - in: query
          name: page
          description: To specify a page, append the page parameter to the URL e.g. ?page=1. If there are 100 records in the response you will need to check if there is any more data by fetching the next page e.g ?page=2 and continuing this process until no more results are returned.
          example: 1
          schema:
            type: integer
        - $ref: '#/components/parameters/pageSize'
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array of all PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: 66910bfc-15cc-4692-bd4c-cc8f671e653c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552523977238)/
                pagination:
                  page: 1
                  pageSize: 100
                  pageCount: 1
                  itemCount: 2
                PurchaseOrders:
                  - PurchaseOrderID: f9627f0d-b715-4039-bb6a-96dc3eae5ec5
                    PurchaseOrderNumber: PO-0001
                    DateString: 2019-03-12T00:00:00
                    Date: /Date(1552348800000+0000)/
                    AttentionTo: Jimmy
                    HasErrors: false
                    IsDiscounted: false
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      Addresses:
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DELETED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.0000
                        TaxAmount: 0.00
                        LineAmount: 20.00
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 0f7b54b8-bfa4-4c5d-9c22-73dbd5796e54
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1552522703443+0000)/
                    HasAttachments: false
                  - PurchaseOrderID: 6afa2e02-c514-4964-ab89-b5c0179b8c50
                    PurchaseOrderNumber: PO-0002
                    DateString: 2019-03-12T00:00:00
                    Date: /Date(1552348800000+0000)/
                    AttentionTo: Jimmy
                    HasErrors: false
                    IsDiscounted: false
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      Addresses:
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DELETED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.0000
                        TaxAmount: 0.00
                        LineAmount: 20.00
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 3e4ec232-32b9-491b-84dd-48fb9aa8916f
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1552522834733+0000)/
                    HasAttachments: false
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPurchaseOrders
      summary: Creates one or more purchase orders
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - purchaseOrder:
          is_object: true
          key: purchaseOrder
          keyPascal: PurchaseOrder
          keySnake: purchase_order
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: purchaseOrder
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: purchaseOrder
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: purchaseOrder
        - purchaseOrders:
          is_object: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
        - add_purchaseOrder:
          is_last: true
          is_array_add: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
          keySnake: purchase_orders
          java: PurchaseOrders
          python: purchase_order
          ruby: purchase_order
          csharp: PurchaseOrder
          object: purchaseOrder
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array for specified PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: aa2f9d23-fd76-4bee-9600-30c0f0f34036
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552522946173)/
                PurchaseOrders:
                  - PurchaseOrderID: 56204648-8fbe-46f8-b09c-2125f7939533
                    PurchaseOrderNumber: PO-0004
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    HasErrors: false
                    IsDiscounted: false
                    TotalDiscount: 0.00
                    SentToContact: false
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - null
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - null
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.0000
                        TaxType: INPUT2
                        TaxAmount: 3.00
                        LineAmount: 20.00
                        AccountCode: "710"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 792b7e40-b9f2-47f0-8624-b09f4b0166dd
                    SubTotal: 20.00
                    TotalTax: 3.00
                    Total: 23.00
                    UpdatedDateUTC: /Date(1552522946077+0000)/
                    StatusAttributeString: ERROR
                    Warnings:
                      - Message: Only AUTHORISED and BILLED purchase orders may have SentToContact updated.
                    ValidationErrors:
                      - Message: Order number must be unique
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: PurchaseOrders with an array of PurchaseOrder object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PurchaseOrders'
            example:
              PurchaseOrders:
                - Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  LineItems:
                    - Description: Foobar
                      Quantity: 1
                      UnitAmount: 20
                      AccountCode: "710"
                  Date: "2019-03-13"
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreatePurchaseOrders
      summary: Updates or creates one or more purchase orders
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - purchaseOrder:
          is_object: true
          key: purchaseOrder
          keyPascal: PurchaseOrder
          keySnake: purchase_order
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: purchaseOrder
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: purchaseOrder
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: purchaseOrder
        - purchaseOrders:
          is_object: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
        - add_purchaseOrder:
          is_last: true
          is_array_add: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
          keySnake: purchase_orders
          java: PurchaseOrders
          python: purchase_order
          ruby: purchase_order
          csharp: PurchaseOrder
          object: purchaseOrder
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array for specified PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: aa2f9d23-fd76-4bee-9600-30c0f0f34036
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552522946173)/
                PurchaseOrders:
                  - PurchaseOrderID: 56204648-8fbe-46f8-b09c-2125f7939533
                    PurchaseOrderNumber: PO-0004
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    HasErrors: false
                    IsDiscounted: false
                    TotalDiscount: 0.00
                    SentToContact: false
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - null
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - null
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.0000
                        TaxType: INPUT2
                        TaxAmount: 3.00
                        LineAmount: 20.00
                        AccountCode: "710"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 792b7e40-b9f2-47f0-8624-b09f4b0166dd
                    SubTotal: 20.00
                    TotalTax: 3.00
                    Total: 23.00
                    UpdatedDateUTC: /Date(1552522946077+0000)/
                    StatusAttributeString: ERROR
                    Warnings:
                      - Message: Only AUTHORISED and BILLED purchase orders may have SentToContact updated.
                    ValidationErrors:
                      - Message: Order number must be unique
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PurchaseOrders'
            example:
              PurchaseOrders:
                - Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  LineItems:
                    - Description: Foobar
                      Quantity: 1
                      UnitAmount: 20
                      AccountCode: "710"
                  Date: "2019-03-13"
  /PurchaseOrders/{PurchaseOrderID}/pdf:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPurchaseOrderAsPdf
      x-path: /PurchaseOrders/{PurchaseOrderID}
      summary: Retrieves specific purchase order as PDF files using a unique purchase order Id
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          description: Success - return response of byte array pdf version of specified Purchase Orders
          content:
            application/pdf:
              schema:
                type: string
                format: binary
  /PurchaseOrders/{PurchaseOrderID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPurchaseOrder
      summary: Retrieves a specific purchase order using a unique purchase order Id
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array for specified PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: 53a8c7a5-92e8-475b-a037-acf7c55c3afd
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553626110950)/
                PurchaseOrders:
                  - PurchaseOrderID: 15369a9f-17b6-4235-83c4-0029256d1c37
                    PurchaseOrderNumber: PO-0006
                    DateString: 2019-03-26T00:00:00
                    Date: /Date(1553558400000+0000)/
                    DeliveryDateString: 2019-03-28T00:00:00
                    DeliveryDate: /Date(1553731200000+0000)/
                    DeliveryAddress: |-
                      101 Grafton Road
                      Roseneath
                      Wellington
                      6011
                      New Zealand
                    AttentionTo: CEO
                    Telephone: 64 123-2222
                    DeliveryInstructions: Drop off at front  door
                    HasErrors: false
                    IsDiscounted: true
                    TotalDiscount: 250.00
                    SentToContact: false
                    Reference: foobar
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - null
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - null
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1553672800957+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      DefaultCurrency: NZD
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    BrandingThemeID: 414d4a87-46d6-4cfc-ab42-4e29d22e5076
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - ItemCode: "123"
                        Description: Brand new Fender Strats
                        UnitAmount: 2500.0000
                        TaxType: INPUT2
                        TaxAmount: 337.50
                        LineAmount: 2250.00
                        AccountCode: "630"
                        Tracking:
                          - Name: Simpsons
                            Option: Homer
                            TrackingCategoryID: 6a68adde-f210-4465-b0a9-0d8cc6f50762
                            TrackingOptionID: 94faf12f-f65c-4331-8004-b0b7c5a2da23
                        Quantity: 1.0000
                        DiscountRate: 10.00
                        LineItemID: 8a9d3eca-e052-43bc-9b87-221d0648c045
                    SubTotal: 2250.00
                    TotalTax: 337.50
                    Total: 2587.50
                    UpdatedDateUTC: /Date(1553626029823+0000)/
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 7d94ccdc-ef7b-4806-87ac-8442f25e593b
                        FileName: HelloWorld.png
                        Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/15369a9f-17b6-4235-83c4-0029256d1c37/Attachments/HelloWorld.png
                        MimeType: image/png
                        ContentLength: 76091
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updatePurchaseOrder
      summary: Updates a specific purchase order
      x-hasAccountingValidationError: true
      x-example:
        - purchaseOrder:
          is_object: true
          key: purchaseOrder
          keyPascal: PurchaseOrder
          keySnake: purchase_order
        - attentionTo:
          is_last: true
          key: attentionTo
          keyPascal: AttentionTo
          default: Peter Parker
          object: purchaseOrder
        - purchaseOrders:
          is_object: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
        - add_purchaseOrder:
          is_last: true
          is_array_add: true
          key: purchaseOrders
          keyPascal: PurchaseOrders
          keySnake: purchase_orders
          java: PurchaseOrders
          python: purchase_order
          ruby: purchase_order
          csharp: PurchaseOrder
          object: purchaseOrder
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array for updated PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: 0e9bb3f8-d68b-4bb2-a54d-7da240a4f51a
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552523976885)/
                PurchaseOrders:
                  - PurchaseOrderID: f9fc1120-c937-489e-84bc-e822190cfe9c
                    PurchaseOrderNumber: PO-0005
                    DateString: 2019-03-13T00:00:00
                    Date: /Date(1552435200000+0000)/
                    AttentionTo: Jimmy
                    HasErrors: false
                    IsDiscounted: false
                    TotalDiscount: 0.00
                    SentToContact: false
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - null
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - null
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.0000
                        TaxType: INPUT2
                        TaxAmount: 3.00
                        LineAmount: 20.00
                        AccountCode: "710"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: d1d9b2cd-c9f2-4445-8d98-0b8096cf4dae
                    SubTotal: 20.00
                    TotalTax: 3.00
                    Total: 23.00
                    UpdatedDateUTC: /Date(1552523976853+0000)/
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PurchaseOrders'
            example:
              PurchaseOrders:
                - AttentionTo: Peter Parker
                  LineItems: []
                  Contact: {}
  /PurchaseOrders/{PurchaseOrderNumber}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPurchaseOrderByNumber
      summary: Retrieves a specific purchase order using purchase order number
      parameters:
        - required: true
          in: path
          name: PurchaseOrderNumber
          x-snake: purchase_order_number
          description: Unique identifier for a PurchaseOrder
          example: PO1234
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type PurchaseOrder array for specified PurchaseOrder
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PurchaseOrders'
              example:
                Id: 53a8c7a5-92e8-475b-a037-acf7c55c3afd
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553626110950)/
                PurchaseOrders:
                  - PurchaseOrderID: 15369a9f-17b6-4235-83c4-0029256d1c37
                    PurchaseOrderNumber: PO-0006
                    DateString: 2019-03-26T00:00:00
                    Date: /Date(1553558400000+0000)/
                    DeliveryDateString: 2019-03-28T00:00:00
                    DeliveryDate: /Date(1553731200000+0000)/
                    DeliveryAddress: |-
                      101 Grafton Road
                      Roseneath
                      Wellington
                      6011
                      New Zealand
                    AttentionTo: CEO
                    Telephone: 64 123-2222
                    DeliveryInstructions: Drop off at front  door
                    HasErrors: false
                    IsDiscounted: true
                    TotalDiscount: 250.00
                    SentToContact: false
                    Reference: foobar
                    Type: PURCHASEORDER
                    CurrencyRate: 1.000000
                    CurrencyCode: NZD
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - null
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - null
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1553672800957+0000)/
                      ContactGroups:
                        - ContactGroupID: 17b44ed7-4389-4162-91cb-3dd5766e4e22
                          Name: Oasis
                          Status: ACTIVE
                          Contacts: []
                          HasValidationErrors: false
                      IsSupplier: true
                      IsCustomer: true
                      DefaultCurrency: NZD
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      HasValidationErrors: false
                    BrandingThemeID: 414d4a87-46d6-4cfc-ab42-4e29d22e5076
                    Status: DRAFT
                    LineAmountTypes: Exclusive
                    LineItems:
                      - ItemCode: "123"
                        Description: Brand new Fender Strats
                        UnitAmount: 2500.0000
                        TaxType: INPUT2
                        TaxAmount: 337.50
                        LineAmount: 2250.00
                        AccountCode: "630"
                        Tracking:
                          - Name: Simpsons
                            Option: Homer
                            TrackingCategoryID: 6a68adde-f210-4465-b0a9-0d8cc6f50762
                            TrackingOptionID: 94faf12f-f65c-4331-8004-b0b7c5a2da23
                        Quantity: 1.0000
                        DiscountRate: 10.00
                        LineItemID: 8a9d3eca-e052-43bc-9b87-221d0648c045
                    SubTotal: 2250.00
                    TotalTax: 337.50
                    Total: 2587.50
                    UpdatedDateUTC: /Date(1553626029823+0000)/
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 7d94ccdc-ef7b-4806-87ac-8442f25e593b
                        FileName: HelloWorld.png
                        Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/15369a9f-17b6-4235-83c4-0029256d1c37/Attachments/HelloWorld.png
                        MimeType: image/png
                        ContentLength: 76091
  /PurchaseOrders/{PurchaseOrderID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getPurchaseOrderHistory
      summary: Retrieves history for a specific purchase order
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createPurchaseOrderHistory
      summary: Creates a history record for a specific purchase orders
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /PurchaseOrders/{PurchaseOrderID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getPurchaseOrderAttachments
      summary: Retrieves attachments for a specific purchase order
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
      responses:
        "200":
          description: Success - return response of type Attachments array of Purchase Orders
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: dfc29f55-8ddd-4921-a82c-bcc0798d207f
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1602100184437)/
                Attachments:
                  - AttachmentID: dce4eaa7-c8a9-4867-9434-95832b427d3b
                    FileName: xero-dev1.png
                    Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/93369c9b-c481-4e21-aaab-bb19e9a26efe/Attachments/2D_2.png
                    MimeType: image/png
                    ContentLength: 98715
                  - AttachmentID: e58bd37b-e47f-451a-a42c-f946ef229c3e
                    FileName: xero-dev2.png
                    Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/93369c9b-c481-4e21-aaab-bb19e9a26efe/Attachments/2D.png
                    MimeType: image/png
                    ContentLength: 82529
                  - AttachmentID: c8faa564-223f-45e4-a5a1-94430a5b52c1
                    FileName: xero-dev3.png
                    Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/93369c9b-c481-4e21-aaab-bb19e9a26efe/Attachments/Screen%20Shot%202020-09-12%20at%204.31.14%20pm.png
                    MimeType: image/png
                    ContentLength: 146384
  /PurchaseOrders/{PurchaseOrderID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getPurchaseOrderAttachmentById
      summary: Retrieves specific attachment for a specific purchase order using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Account as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /PurchaseOrders/{PurchaseOrderID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getPurchaseOrderAttachmentByFileName
      summary: Retrieves a specific attachment for a specific purchase order by filename
      parameters:
        - $ref: '#/components/parameters/PurchaseOrderID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Purchase Order as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updatePurchaseOrderAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment for a specific purchase order by filename
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PurchaseOrderID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: aeff9be0-54c2-45dd-8e3d-aa4f8af0fbd7
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1602100086197)/
                Attachments:
                  - AttachmentID: dce4eaa7-c8a9-4867-9434-95832b427d3b
                    FileName: xero-dev.png
                    Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/93369c9b-c481-4e21-aaab-bb19e9a26efe/Attachments/2D_2.png
                    MimeType: image/png
                    ContentLength: 98715
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createPurchaseOrderAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates attachment for a specific purchase order
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/PurchaseOrderID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: c728a4a4-179e-4bbd-a2d5-63e7f9ceba92
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1602099934723)/
                Attachments:
                  - AttachmentID: e58bd37b-e47f-451a-a42c-f946ef229c3e
                    FileName: xero-dev.png
                    Url: https://api.xero.com/api.xro/2.0/PurchaseOrders/93369c9b-c481-4e21-aaab-bb19e9a26efe/Attachments/2D.png
                    MimeType: image/png
                    ContentLength: 82529
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /Quotes:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getQuotes
      summary: Retrieves sales quotes
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: DateFrom
          x-snake: date_from
          description: Filter for quotes after a particular date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: DateTo
          x-snake: date_to
          description: Filter for quotes before a particular date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: ExpiryDateFrom
          x-snake: expiry_date_from
          description: Filter for quotes expiring after a particular date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: ExpiryDateTo
          x-snake: expiry_date_to
          description: Filter for quotes before a particular date
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: ContactID
          x-snake: contact_id
          description: Filter for quotes belonging to a particular contact
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: Status
          x-snake: status
          description: Filter for quotes of a particular Status
          example: DRAFT
          schema:
            type: string
        - in: query
          name: page
          description: e.g. page=1 – Up to 100 Quotes will be returned in a single API call with line items shown for each quote
          example: 1
          schema:
            type: integer
        - in: query
          name: order
          description: Order by an any element
          example: Status ASC
          schema:
            type: string
        - in: query
          name: QuoteNumber
          x-snake: quote_number
          description: Filter by quote number (e.g. GET https://.../Quotes?QuoteNumber=QU-0001)
          example: QU-0001
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type quotes array with all quotes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Quotes'
              example:
                Id: bb583e7e-9b6b-471e-88da-4cbfcfad7a57
                Status: OK
                ProviderName: Adams OAuth2 App
                DateTimeUTC: /Date(1571876635477)/
                Quotes:
                  - QuoteID: be59294f-2a9c-4cee-8c64-0f0ddbc1883a
                    QuoteNumber: QU-0001
                    Reference: REF-123
                    Terms: Not valid after the expiry date
                    Contact:
                      ContactID: 060816db-0ed7-44de-ab58-8fee9316fcd5
                      Name: Adam
                    LineItems:
                      - LineItemID: ccf5e45c-73b6-4659-83e8-520f4c6126fd
                        AccountCode: "200"
                        Description: Fish out of Water
                        UnitAmount: 19.9500
                        DiscountRate: 10.00
                        LineAmount: 17.96
                        ItemCode: BOOK
                        Quantity: 1.0000
                        TaxAmount: 2.69
                        TaxType: OUTPUT2
                        Tracking:
                          - TrackingCategoryID: 351953c4-8127-4009-88c3-f9cd8c9cbe9f
                            TrackingOptionID: ce205173-7387-4651-9726-2cf4c5405ba2
                            Name: Region
                            Option: Eastside
                    Date: /Date(1571875200000)/
                    DateString: 2019-10-24T00:00:00
                    ExpiryDate: /Date(1571961600000)/
                    ExpiryDateString: 2019-10-25T00:00:00
                    Status: ACCEPTED
                    CurrencyRate: 0.937053
                    CurrencyCode: AUD
                    SubTotal: 17.96
                    TotalTax: 2.69
                    Total: 20.65
                    TotalDiscount: 1.99
                    Title: Your Quote
                    Summary: Please buy this
                    BrandingThemeID: 4c82c365-35cb-467f-bb11-dce1f2f2f67c
                    UpdatedDateUTC: /Date(1571869373890)/
                    LineAmountTypes: EXCLUSIVE
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createQuotes
      summary: Create one or more quotes
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - quote:
          is_object: true
          key: quote
          keyPascal: Quote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: quote
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: quote
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: quote
        - quotes:
          is_object: true
          key: quotes
          keyPascal: Quotes
        - add_quote:
          is_last: true
          is_array_add: true
          key: quotes
          keyPascal: Quotes
          java: Quotes
          csharp: Quote
          object: quote
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Quotes with array with newly created Quote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Quotes'
              example:
                SummarizeErrors: false
                Id: 29571f5a-bf73-4bb6-9de5-86be44e6bf2e
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1580607782916)/
                Quotes:
                  - QuoteID: 60031d53-6488-4321-9cbd-c1db6dbf9ba4
                    QuoteNumber: QU-0008
                    Terms: ""
                    Contact:
                      ContactID: 6a65f055-b0e0-471a-a933-d1ffdd89393f
                      Name: John Smith-82160
                      EmailAddress: ""
                    LineItems:
                      - LineItemID: 26995857-0eea-45fb-b46c-f8ea896ec46e
                        AccountCode: "12775"
                        Description: Foobar
                        UnitAmount: 20.0000
                        LineAmount: 20.00
                        ItemCode: ""
                        Quantity: 1.0000
                        TaxAmount: 0.00
                        Tracking: []
                    Date: /Date(1580515200000)/
                    DateString: 2020-02-01T00:00:00
                    Status: DRAFT
                    CurrencyRate: 1.000000
                    CurrencyCode: USD
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1580607782913)/
                    LineAmountTypes: EXCLUSIVE
                    StatusAttributeString: OK
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Quotes with an array of Quote object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Quotes'
            example:
              Quotes:
                - Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  LineItems:
                    - Description: Foobar
                      Quantity: 1
                      UnitAmount: 20
                      AccountCode: "12775"
                  Date: "2020-02-01"
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateQuotes
      summary: Updates or creates one or more quotes
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - quote:
          is_object: true
          key: quote
          keyPascal: Quote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: quote
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: quote
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: quote
        - quotes:
          is_object: true
          key: quotes
          keyPascal: Quotes
        - add_quote:
          is_last: true
          is_array_add: true
          key: quotes
          keyPascal: Quotes
          java: Quotes
          csharp: Quote
          object: quote
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Quotes array with updated or created Quote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Quotes'
              example:
                SummarizeErrors: false
                Id: b425754f-0512-481d-827b-c8958db7667e
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1580607783833)/
                Quotes:
                  - QuoteID: fd53e0b7-4d24-4c20-be85-043a62ea5847
                    QuoteNumber: QU-0009
                    Terms: ""
                    Contact:
                      ContactID: 6a65f055-b0e0-471a-a933-d1ffdd89393f
                      Name: John Smith-82160
                      EmailAddress: ""
                    LineItems:
                      - LineItemID: 898c7fd6-0d94-4ac0-ace8-87e350a042de
                        AccountCode: "12775"
                        Description: Foobar
                        UnitAmount: 20.0000
                        LineAmount: 20.00
                        ItemCode: ""
                        Quantity: 1.0000
                        TaxAmount: 0.00
                        Tracking: []
                    Date: /Date(1580515200000)/
                    DateString: 2020-02-01T00:00:00
                    Status: DRAFT
                    CurrencyRate: 1.000000
                    CurrencyCode: USD
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1580607783467)/
                    LineAmountTypes: EXCLUSIVE
                    StatusAttributeString: OK
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Quotes'
            example:
              Quotes:
                - Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  LineItems:
                    - Description: Foobar
                      Quantity: 1
                      UnitAmount: 20
                      AccountCode: "12775"
                  Date: "2020-02-01"
  /Quotes/{QuoteID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getQuote
      summary: Retrieves a specific quote using a unique quote Id
      parameters:
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          description: Success - return response of type Quotes array with specified Quote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Quotes'
              example:
                SummarizeErrors: true
                Id: e3626c45-77f1-4ab0-ba9b-3593c7bcd25c
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1580607864786)/
                Quotes:
                  - QuoteID: 1f90e77a-7b88-4462-874f-1aa675be8fef
                    QuoteNumber: QU-0007
                    Reference: MyQuote
                    Terms: These are my terms
                    Contact:
                      ContactID: 4bc3ecb2-8e2a-4267-a171-0e0ce7e5ac2a
                      Name: ABC Limited
                      EmailAddress: john.smith@gmail.com
                      FirstName: John
                      LastName: Smith
                    LineItems:
                      - LineItemID: 09b47d9f-f78d-4bab-b226-957f55bfb1b5
                        AccountCode: "400"
                        Description: Half day training - Microsoft Office
                        UnitAmount: 500.0000
                        LineAmount: 500.00
                        ItemCode: Train-MS
                        Quantity: 1.0000
                        TaxAmount: 0.00
                        TaxType: NONE
                        Tracking:
                          - TrackingCategoryID: 9bd3f506-6d91-4625-81f0-0f9147f099f4
                            TrackingOptionID: d30e2a0d-ae6f-4806-88ca-d8ebdba2af73
                            Name: Avengers
                            Option: IronMan
                    Date: /Date(1580515200000)/
                    DateString: 2020-02-01T00:00:00
                    ExpiryDate: /Date(1581724800000)/
                    ExpiryDateString: 2020-02-15T00:00:00
                    Status: DRAFT
                    CurrencyRate: 1.547150
                    CurrencyCode: NZD
                    SubTotal: 500.00
                    TotalTax: 0.00
                    Total: 500.00
                    TotalDiscount: 0.00
                    Title: ""
                    Summary: ""
                    BrandingThemeID: 324587a9-7eed-46c0-ad64-fa941a1b5b3e
                    UpdatedDateUTC: /Date(1580607757040)/
                    LineAmountTypes: EXCLUSIVE
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateQuote
      summary: Updates a specific quote
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          keySnake: date_value
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-12-03T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - quote:
          is_object: true
          key: quote
          keyPascal: Quote
        - reference:
          key: reference
          keyPascal: Reference
          default: I am an update
          object: quote
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: quote
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          python: date_value
          ruby: date_value
          object: quote
        - quotes:
          is_object: true
          key: quotes
          keyPascal: Quotes
        - add_quote:
          is_last: true
          is_array_add: true
          key: quotes
          keyPascal: Quotes
          java: Quotes
          csharp: Quote
          object: quote
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          description: Success - return response of type Quotes array with updated Quote
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Quotes'
              example:
                SummarizeErrors: true
                Id: be4f43a7-ef02-497a-96c2-fc0bc047a82a
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1580605644385)/
                Quotes:
                  - QuoteID: 8ce6b14c-ef87-4f45-93f0-853137c6d0e1
                    QuoteNumber: QU-0008
                    Reference: I am an update
                    Terms: ""
                    Contact:
                      ContactID: 8ed7dd03-4e6a-4078-a807-c5309abfec52
                      Name: Orlena Greenville 35
                      EmailAddress: ""
                    LineItems:
                      - LineItemID: be69f44e-9c72-4fcd-9152-0174867cce49
                        AccountCode: "12775"
                        Description: Foobar
                        UnitAmount: 20.0000
                        LineAmount: 20.00
                        ItemCode: ""
                        Quantity: 1.0000
                        TaxAmount: 0.00
                        Tracking: []
                    Date: /Date(1580515200000)/
                    DateString: 2020-02-01T00:00:00
                    Status: DRAFT
                    CurrencyRate: 1.000000
                    CurrencyCode: USD
                    SubTotal: 20.00
                    TotalTax: 0.00
                    Total: 20.00
                    UpdatedDateUTC: /Date(1580605644360)/
                    LineAmountTypes: EXCLUSIVE
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Quotes'
            example:
              Quotes:
                - Reference: I am an update
                  Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  Date: "2020-02-01"
  /Quotes/{QuoteID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getQuoteHistory
      summary: Retrieves history records of a specific quote
      parameters:
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createQuoteHistory
      summary: Creates a history record for a specific quote
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Quotes/{QuoteID}/pdf:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getQuoteAsPdf
      x-path: /Quotes/{QuoteID}
      summary: Retrieves a specific quote as a PDF file using a unique quote Id
      parameters:
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          description: Success - return response of byte array pdf version of specified Quotes
          content:
            application/pdf:
              schema:
                type: string
                format: binary
  /Quotes/{QuoteID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getQuoteAttachments
      summary: Retrieves attachments for a specific quote
      parameters:
        - $ref: '#/components/parameters/QuoteID'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 439c1573-3cd8-4697-a9f6-81fa651ee8f3
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550852630329)/
                Attachments:
                  - AttachmentID: 52a643be-cd5c-489f-9778-53a9fd337756
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Quotes/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
  /Quotes/{QuoteID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getQuoteAttachmentById
      summary: Retrieves a specific attachment from a specific quote using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/QuoteID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Quote as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /Quotes/{QuoteID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getQuoteAttachmentByFileName
      summary: Retrieves a specific attachment from a specific quote by filename
      parameters:
        - $ref: '#/components/parameters/QuoteID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Quote as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateQuoteAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment from a specific quote by filename
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/QuoteID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: c8d6413a-1da2-4faa-9848-21f60443e906
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550859714477)/
                Attachments:
                  - AttachmentID: 3fa85f64-5717-4562-b3fc-2c963f66afa6
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Quotes/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          description: Validation Error - some data was incorrect returns response of type Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createQuoteAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates attachment for a specific quote
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/QuoteID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachment
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 724cdff5-bcd1-4c5c-977e-e864c24258e0
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550856817769)/
                Attachments:
                  - AttachmentID: ab95b276-9dce-4925-9077-439818ba270f
                    FileName: sample5.jpg
                    Url: https://api.xero.com/api.xro/2.0/Quotes/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /Receipts:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getReceipts
      summary: Retrieves draft expense claim receipts for any user
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="DRAFT"
          x-example-csharp: Status==\"DRAFT\"
          x-example-java: Status==&quot;&apos; + Receipt.StatusEnum.DRAFT + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\Receipt::STATUS_DRAFT . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::Receipt::DRAFT}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: ReceiptNumber ASC
          schema:
            type: string
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Receipts array for all Receipt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Receipts'
              example:
                Id: 078b2a2c-902f-4154-8739-357ece5982e5
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552524584695)/
                Receipts:
                  - ReceiptID: a44fd147-af4e-4fe8-a09a-55332df74162
                    ReceiptNumber: 1
                    Status: DRAFT
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      FirstName: 'API '
                      LastName: Team
                      ValidationErrors: []
                      Warnings: []
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      SalesTrackingCategories: []
                      PurchasesTrackingCategories: []
                      ContactPersons: []
                      Attachments: []
                      HasValidationErrors: false
                      ValidationErrors: []
                      Warnings: []
                    Date: /Date(1552435200000+0000)/
                    UpdatedDateUTC: /Date(1552524583983+0000)/
                    Reference: ""
                    LineAmountTypes: NoTax
                    LineItems: []
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    ID: a44fd147-af4e-4fe8-a09a-55332df74162
                    HasAttachments: false
                    Attachments: []
                    ValidationErrors: []
                    Warnings: []
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createReceipt
      summary: Creates draft expense claim receipts for any user
      x-hasAccountingValidationError: true
      x-example:
        - contact:
          is_object: true
          key: contact
          keyPascal: Contact
        - contactID:
          is_last: true
          is_uuid: true
          key: contactID
          keyPascal: ContactID
          keySnake: contact_id
          default: 00000000-0000-0000-0000-000000000000
          object: contact
        - user:
          is_object: true
          key: user
          keyPascal: User
        - userID:
          is_last: true
          is_uuid: true
          key: userID
          keyPascal: UserID
          keySnake: user_id
          default: 00000000-0000-0000-0000-000000000000
          object: user
        - lineItem:
          is_object: true
          key: lineItem
          keyPascal: LineItem
          keySnake: line_item
        - description:
          key: description
          keyPascal: Description
          default: Foobar
          object: lineItem
        - quantity:
          nonString: true
          key: quantity
          keyPascal: Quantity
          default: 1.0
          is_money: true
          object: lineItem
        - unitAmount:
          nonString: true
          key: unitAmount
          keyPascal: UnitAmount
          keySnake: unit_amount
          default: 20.0
          is_money: true
          object: lineItem
        - accountCode:
          is_last: true
          key: accountCode
          keyPascal: AccountCode
          keySnake: account_code
          default: "000"
          object: lineItem
        - line_items:
          is_list: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          csharp: LineItem
          java: LineItem
        - add_lineitems:
          is_last: true
          is_list_add: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          java: LineItems
          python: line_item
          ruby: line_item
          csharp: LineItem
          object: lineItem
        - receipt:
          is_object: true
          key: receipt
          keyPascal: Receipt
        - set_contact:
          is_variable: true
          nonString: true
          key: contact
          keyPascal: Contact
          default: contact
          object: receipt
        - set_user:
          is_variable: true
          nonString: true
          key: user
          keyPascal: User
          default: user
          object: receipt
        - set_lineitem:
          is_variable: true
          nonString: true
          key: lineItems
          keyPascal: LineItems
          keySnake: line_items
          default: lineItems
          python: line_items
          ruby: line_items
          object: receipt
        - lineAmountTypes:
          nonString: true
          key: lineAmountTypes
          keyPascal: LineAmountTypes
          keySnake: line_amount_types
          default: INCLUSIVE
          php: XeroAPI\XeroPHP\Models\Accounting\LineAmountTypes::INCLUSIVE
          node: LineAmountTypes.Inclusive
          ruby: XeroRuby::Accounting::INCLUSIVE
          python: LineAmountTypes.INCLUSIVE
          java: com.xero.models.accounting.LineAmountTypes.INCLUSIVE
          csharp: LineAmountTypes.Exclusive
          object: receipt
        - status:
          is_last: true
          nonString: true
          key: status
          keyPascal: Status
          default: DRAFT
          php: XeroAPI\XeroPHP\Models\Accounting\Receipt::STATUS_DRAFT
          node: Receipt.StatusEnum.DRAFT
          ruby: XeroRuby::Accounting::Receipt::DRAFT
          python_string: DRAFT
          java: com.xero.models.accounting.Receipt.StatusEnum.DRAFT
          csharp: Receipt.StatusEnum.DRAFT
          object: receipt
        - receipts:
          is_object: true
          key: receipts
          keyPascal: Receipts
        - add_receipt:
          is_last: true
          is_array_add: true
          key: receipts
          keyPascal: Receipts
          java: Receipts
          csharp: Receipt
          object: receipt
      parameters:
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Receipts array for newly created Receipt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Receipts'
              example:
                Id: 35898898-5361-4b42-b6ca-9d2c584fc53d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552524583429)/
                Receipts:
                  - ReceiptID: a44fd147-af4e-4fe8-a09a-55332df74162
                    ReceiptNumber: 1
                    Status: DRAFT
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Date: /Date(1552521600000+0000)/
                    UpdatedDateUTC: /Date(1552524583367+0000)/
                    Reference: ""
                    LineAmountTypes: NoTax
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    ID: a44fd147-af4e-4fe8-a09a-55332df74162
                    HasAttachments: false
                    ValidationErrors:
                      - Message: A valid user should be identified using the UserID.
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Receipts with an array of Receipt object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Receipts'
            example:
              Receipts:
                - Contact:
                    ContactID: 00000000-0000-0000-0000-000000000000
                  Lineitems:
                    - Description: Foobar
                      Quantity: 2
                      UnitAmount: 20
                      AccountCode: "400"
                      TaxType: NONE
                      LineAmount: 40
                  User:
                    UserID: 00000000-0000-0000-0000-000000000000
                  LineAmountTypes: NoTax
                  Status: DRAFT
  /Receipts/{ReceiptID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getReceipt
      summary: Retrieves a specific draft expense claim receipt by using a unique receipt Id
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/unitdp'
      responses:
        "200":
          description: Success - return response of type Receipts array for a specified Receipt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Receipts'
              example:
                Id: 2c99af06-d278-4580-8c8c-463c806af5b6
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553800357225)/
                Receipts:
                  - ReceiptID: a44fd147-af4e-4fe8-a09a-55332df74162
                    ReceiptNumber: 1
                    Status: DRAFT
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1553672800957+0000)/
                      ContactGroups: []
                      DefaultCurrency: NZD
                      ContactPersons: []
                      HasValidationErrors: false
                    Date: /Date(1552435200000+0000)/
                    UpdatedDateUTC: /Date(1552524583983+0000)/
                    Reference: Foobar
                    LineAmountTypes: NoTax
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                        DiscountEnteredAsPercent: true
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    ID: a44fd147-af4e-4fe8-a09a-55332df74162
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: e02a84f6-b83a-4983-b3b9-35cd8880c7bc
                        FileName: HelloWorld.jpg
                        Url: https://api.xero.com/api.xro/2.0/receipts/a44fd147-af4e-4fe8-a09a-55332df74162/Attachments/HelloWorld.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                      - AttachmentID: 3451e34c-66a6-42b0-91e2-88618bdc169b
                        FileName: foobar.jpg
                        Url: https://api.xero.com/api.xro/2.0/receipts/a44fd147-af4e-4fe8-a09a-55332df74162/Attachments/foobar.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateReceipt
      summary: Updates a specific draft expense claim receipts
      x-hasAccountingValidationError: true
      x-example:
        - dateValue:
          is_date: true
          key: dateValue
          keyPascal: Date
          java_datatype: LocalDate
          default: LocalDate.of(2020, Month.OCTOBER, 10)
          java: LocalDate.now()
          csharp: DateTime.Now
          php: new DateTime('2020-12-10')
          node: '''2020-10-10'''
          python: dateutil.parser.parse('2020-10-10T00:00:00Z')
          ruby: '''YYYY-MM-DD'''
        - user:
          is_object: true
          key: user
          keyPascal: User
        - userID:
          is_last: true
          is_uuid: true
          key: userID
          keyPascal: UserID
          keySnake: user_id
          default: 00000000-0000-0000-0000-000000000000
          object: user
        - receipt:
          is_object: true
          key: receipt
          keyPascal: Receipt
        - set_user:
          is_variable: true
          nonString: true
          key: user
          keyPascal: User
          default: user
          object: receipt
        - reference:
          key: reference
          keyPascal: Reference
          default: Foobar
          object: receipt
        - date:
          is_last: true
          is_variable: true
          nonString: true
          key: date
          keyPascal: Date
          default: dateValue
          object: receipt
        - receipts:
          is_object: true
          key: receipts
          keyPascal: Receipts
        - add_receipt:
          is_last: true
          is_array_add: true
          key: receipts
          keyPascal: Receipts
          java: Receipts
          csharp: Receipt
          object: receipt
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/unitdp'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type Receipts array for updated Receipt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Receipts'
              example:
                Id: 05b76bf7-4734-4633-a399-7d569a6a25c6
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552675557052)/
                Receipts:
                  - ReceiptID: e3686fdc-c661-4581-b9df-cbb20782ea66
                    ReceiptNumber: 2
                    Status: DRAFT
                    User:
                      UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                      EmailAddress: api@xero.com
                      FirstName: 'API '
                      LastName: Team
                      UpdatedDateUTC: /Date(1511957179217+0000)/
                      IsSubscriber: true
                      OrganisationRole: FINANCIALADVISER
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      ContactStatus: ACTIVE
                      Name: Liam Gallagher
                      FirstName: Liam
                      LastName: Gallagher
                      EmailAddress: liam@rockstar.com
                      BankAccountDetails: ""
                      Addresses:
                        - AddressType: STREET
                          City: ""
                          Region: ""
                          PostalCode: ""
                          Country: ""
                          AttentionTo: ""
                        - AddressType: POBOX
                          City: Anytown
                          Region: NY
                          PostalCode: "10101"
                          Country: USA
                          AttentionTo: ""
                      Phones:
                        - PhoneType: DEFAULT
                          PhoneNumber: 222-2222
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: DDI
                          PhoneNumber: ""
                          PhoneAreaCode: ""
                          PhoneCountryCode: ""
                        - PhoneType: FAX
                          PhoneNumber: 333-2233
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                        - PhoneType: MOBILE
                          PhoneNumber: 444-3433
                          PhoneAreaCode: "212"
                          PhoneCountryCode: ""
                      UpdatedDateUTC: /Date(1551747281053+0000)/
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Date: /Date(1552694400000+0000)/
                    UpdatedDateUTC: /Date(1552675556927+0000)/
                    Reference: Foobar
                    LineAmountTypes: NoTax
                    LineItems:
                      - Description: Foobar
                        UnitAmount: 20.00
                        TaxType: NONE
                        TaxAmount: 0.00
                        LineAmount: 40.00
                        AccountCode: "400"
                        Tracking: []
                        Quantity: 2.0000
                    SubTotal: 40.00
                    TotalTax: 0.00
                    Total: 40.00
                    ID: e3686fdc-c661-4581-b9df-cbb20782ea66
                    HasAttachments: false
                    ValidationErrors: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Receipts'
            example:
              Receipts:
                - Lineitems: []
                  User:
                    UserID: 00000000-0000-0000-0000-000000000000
                  Reference: Foobar
  /Receipts/{ReceiptID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getReceiptAttachments
      summary: Retrieves attachments for a specific expense claim receipt
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
      responses:
        "200":
          description: Success - return response of type Attachments array of Attachments for a specified Receipt
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: d379c04d-d3aa-4034-95b8-af69a449bd78
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552686430436)/
                Attachments:
                  - AttachmentID: 11e5ca6b-d38c-42ab-a29f-c1710d171aa1
                    FileName: giphy.gif
                    Url: https://api.xero.com/api.xro/2.0/Receipts/7923c00d-163d-404c-a608-af3de333db29/Attachments/giphy.gif
                    MimeType: image/gif
                    ContentLength: 495727
  /Receipts/{ReceiptID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getReceiptAttachmentById
      summary: Retrieves a specific attachments from a specific expense claim receipts by using a unique attachment Id
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Receipt as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /Receipts/{ReceiptID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getReceiptAttachmentByFileName
      summary: Retrieves a specific attachment from a specific expense claim receipts by file name
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Receipt as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateReceiptAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment on a specific expense claim receipts by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with updated Attachment for a specified Receipt
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: aeca1ea8-8fd9-4757-96a6-397dc4957a69
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552686602761)/
                Attachments:
                  - AttachmentID: e02a84f6-b83a-4983-b3b9-35cd8880c7bc
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/Receipts/a44fd147-af4e-4fe8-a09a-55332df74162/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createReceiptAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment on a specific expense claim receipts by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ReceiptID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with newly created Attachment for a specified Receipt
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 01c9a720-b1f1-4477-8de8-ff46d945fd1d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1552686599884)/
                Attachments:
                  - AttachmentID: 3451e34c-66a6-42b0-91e2-88618bdc169b
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/Receipts/a44fd147-af4e-4fe8-a09a-55332df74162/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /Receipts/{ReceiptID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getReceiptHistory
      summary: Retrieves a history record for a specific receipt
      parameters:
        - $ref: '#/components/parameters/ReceiptID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createReceiptHistory
      summary: Creates a history record for a specific receipt
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/ReceiptID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          description: Unsupported - return response incorrect exception, API is not able to create HistoryRecord for Receipts
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                ErrorNumber: 10
                Type: ValidationException
                Message: A validation exception occurred
                Elements:
                  - DateUTCString: 2019-03-15T21:51:50
                    DateUTC: /Date(1552686710791)/
                    Details: Hello World
                    ValidationErrors:
                      - Message: The document with the supplied id was not found for this endpoint.
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /RepeatingInvoices:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getRepeatingInvoices
      summary: Retrieves repeating invoices
      parameters:
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="DRAFT"
          x-example-csharp: Status==\"DRAFT\"
          x-example-java: Status==&quot;&apos; + RepeatingInvoice.StatusEnum.DRAFT + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\RepeatingInvoice::STATUS_DRAFT . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::RepeatingInvoice::DRAFT}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Total ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Repeating Invoices array for all Repeating Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RepeatingInvoices'
              example:
                Id: b336833d-a3a8-4a67-ab4c-6280b3ad87b0
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805183228)/
                RepeatingInvoices:
                  - Schedule:
                      Period: 1
                      Unit: MONTHLY
                      DueDate: 10
                      DueDateType: OFFOLLOWINGMONTH
                      StartDate: /Date(1555286400000+0000)/
                      EndDate: /Date(1569801600000+0000)/
                      NextScheduledDate: /Date(1555286400000+0000)/
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Type: ACCREC
                    Reference: '[Week]'
                    HasAttachments: true
                    ApprovedForSending: false
                    SendCopy: false
                    MarkAsSent: false
                    IncludePDF: false
                    ID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Guitars Fender Strat
                        UnitAmount: 5000.00
                        TaxType: OUTPUT2
                        TaxAmount: 750.00
                        LineAmount: 5000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                        DiscountEnteredAsPercent: true
                    SubTotal: 5000.00
                    TotalTax: 750.00
                    Total: 5750.00
                    CurrencyCode: NZD
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createRepeatingInvoices
      summary: Creates one or more repeating invoice templates
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type RepeatingInvoices array with newly created RepeatingInvoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RepeatingInvoices'
              example:
                Id: b336833d-a3a8-4a67-ab4c-6280b3ad87b0
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805183228)/
                RepeatingInvoices:
                  - Schedule:
                      Period: 1
                      Unit: MONTHLY
                      DueDate: 10
                      DueDateType: OFFOLLOWINGMONTH
                      StartDate: /Date(1555286400000+0000)/
                      EndDate: /Date(1569801600000+0000)/
                      NextScheduledDate: /Date(1555286400000+0000)/
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Type: ACCREC
                    Reference: '[Week]'
                    HasAttachments: true
                    ApprovedForSending: false
                    SendCopy: false
                    MarkAsSent: false
                    IncludePDF: false
                    ID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Guitars Fender Strat
                        UnitAmount: 5000.00
                        TaxType: OUTPUT2
                        TaxAmount: 750.00
                        LineAmount: 5000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                        DiscountEnteredAsPercent: true
                    SubTotal: 5000.00
                    TotalTax: 750.00
                    Total: 5750.00
                    CurrencyCode: NZD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: RepeatingInvoices with an array of repeating invoice objects in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RepeatingInvoices'
            example:
              RepeatingInvoices:
                - Schedule:
                    Period: 1
                    Unit: MONTHLY
                    DueDate: 10
                    DueDateType: OFFOLLOWINGMONTH
                    StartDate: /Date(1555286400000+0000)/
                  Type: ACCREC
                  Reference: '[Week]'
                  ApprovedForSending: false
                  SendCopy: false
                  MarkAsSent: false
                  IncludePDF: false
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                    Name: Liam Gallagher
                  Status: AUTHORISED
                  LineAmountTypes: Exclusive
                  LineItems:
                    - Description: Guitars Fender Strat
                      UnitAmount: 5000.00
                      TaxType: OUTPUT2
                      TaxAmount: 750.00
                      LineAmount: 5000.00
                      AccountCode: "200"
                      Tracking: []
                      Quantity: 1.0000
                      LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                      DiscountEnteredAsPercent: true
                  CurrencyCode: NZD
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateOrCreateRepeatingInvoices
      summary: Creates or deletes one or more repeating invoice templates
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/summarizeErrors'
        - $ref: '#/components/parameters/idempotencyKey'
      responses:
        "200":
          description: Success - return response of type RepeatingInvoices array with newly created RepeatingInvoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RepeatingInvoices'
              example:
                Id: b336833d-a3a8-4a67-ab4c-6280b3ad87b0
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805183228)/
                RepeatingInvoices:
                  - Schedule:
                      Period: 1
                      Unit: MONTHLY
                      DueDate: 10
                      DueDateType: OFFOLLOWINGMONTH
                      StartDate: /Date(1555286400000+0000)/
                      EndDate: /Date(1569801600000+0000)/
                      NextScheduledDate: /Date(1555286400000+0000)/
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Type: ACCREC
                    Reference: '[Week]'
                    HasAttachments: true
                    ApprovedForSending: false
                    SendCopy: false
                    MarkAsSent: false
                    IncludePDF: false
                    ID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Guitars Fender Strat
                        UnitAmount: 5000.00
                        TaxType: OUTPUT2
                        TaxAmount: 750.00
                        LineAmount: 5000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                        DiscountEnteredAsPercent: true
                    SubTotal: 5000.00
                    TotalTax: 750.00
                    Total: 5750.00
                    CurrencyCode: NZD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: RepeatingInvoices with an array of repeating invoice objects in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RepeatingInvoices'
            example:
              RepeatingInvoices:
                - Schedule:
                    Period: 1
                    Unit: MONTHLY
                    DueDate: 10
                    DueDateType: OFFOLLOWINGMONTH
                    StartDate: /Date(1555286400000+0000)/
                  Type: ACCREC
                  Reference: '[Week]'
                  ApprovedForSending: false
                  SendCopy: false
                  MarkAsSent: false
                  IncludePDF: false
                  Contact:
                    ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                    Name: Liam Gallagher
                  Status: AUTHORISED
                  LineAmountTypes: Exclusive
                  LineItems:
                    - Description: Guitars Fender Strat
                      UnitAmount: 5000.00
                      TaxType: OUTPUT2
                      TaxAmount: 750.00
                      LineAmount: 5000.00
                      AccountCode: "200"
                      Tracking: []
                      Quantity: 1.0000
                      LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                      DiscountEnteredAsPercent: true
                  CurrencyCode: NZD
  /RepeatingInvoices/{RepeatingInvoiceID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getRepeatingInvoice
      summary: Retrieves a specific repeating invoice by using a unique repeating invoice Id
      parameters:
        - $ref: '#/components/parameters/RepeatingInvoiceID'
      responses:
        "200":
          description: Success - return response of type Repeating Invoices array with a specified Repeating Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RepeatingInvoices'
              example:
                Id: d9ac3755-7b81-4e3a-bef0-fa8a4f171442
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805184820)/
                RepeatingInvoices:
                  - Schedule:
                      Period: 1
                      Unit: MONTHLY
                      DueDate: 10
                      DueDateType: OFFOLLOWINGMONTH
                      StartDate: /Date(1555286400000+0000)/
                      EndDate: /Date(1569801600000+0000)/
                      NextScheduledDate: /Date(1555286400000+0000)/
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Type: ACCREC
                    Reference: '[Week]'
                    HasAttachments: true
                    Attachments:
                      - AttachmentID: 2a488b0f-3966-4b6e-a7e1-b6d3286351f2
                        FileName: HelloWorld.jpg
                        Url: https://api.xero.com/api.xro/2.0/Invoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/HelloWorld.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                      - AttachmentID: 48294e40-bfd2-4027-a365-f034383cb7aa
                        FileName: foobar.jpg
                        Url: https://api.xero.com/api.xro/2.0/Invoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/foobar.jpg
                        MimeType: image/jpg
                        ContentLength: 2878711
                      - AttachmentID: 528e978a-87b8-44c4-9465-9456ec2f7ee6
                        FileName: helo-heros.jpg
                        Url: https://api.xero.com/api.xro/2.0/Invoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/helo-heros.jpg
                        MimeType: image/jpeg
                        ContentLength: 2878711
                    ID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: AUTHORISED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Guitars Fender Strat
                        UnitAmount: 5000.00
                        TaxType: OUTPUT2
                        TaxAmount: 750.00
                        LineAmount: 5000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                        DiscountEnteredAsPercent: true
                    SubTotal: 5000.00
                    TotalTax: 750.00
                    Total: 5750.00
                    CurrencyCode: NZD
    post:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: updateRepeatingInvoice
      summary: Deletes a specific repeating invoice template
      x-hasAccountingValidationError: true
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/RepeatingInvoiceID'
      responses:
        "200":
          description: Success - return response of type RepeatingInvoices array with deleted Invoice
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RepeatingInvoices'
              example:
                Id: b336833d-a3a8-4a67-ab4c-6280b3ad87b0
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805183228)/
                RepeatingInvoices:
                  - Schedule:
                      Period: 1
                      Unit: MONTHLY
                      DueDate: 10
                      DueDateType: OFFOLLOWINGMONTH
                      StartDate: /Date(1555286400000+0000)/
                      EndDate: /Date(1569801600000+0000)/
                      NextScheduledDate: /Date(1555286400000+0000)/
                    RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Type: ACCREC
                    Reference: '[Week]'
                    HasAttachments: true
                    ApprovedForSending: false
                    SendCopy: false
                    MarkAsSent: false
                    IncludePDF: false
                    ID: 428c0d75-909f-4b04-8403-a48dc27283b0
                    Contact:
                      ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                      Name: Liam Gallagher
                      Addresses: []
                      Phones: []
                      ContactGroups: []
                      ContactPersons: []
                      HasValidationErrors: false
                    Status: DELETED
                    LineAmountTypes: Exclusive
                    LineItems:
                      - Description: Guitars Fender Strat
                        UnitAmount: 5000.00
                        TaxType: OUTPUT2
                        TaxAmount: 750.00
                        LineAmount: 5000.00
                        AccountCode: "200"
                        Tracking: []
                        Quantity: 1.0000
                        LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                        DiscountEnteredAsPercent: true
                    SubTotal: 5000.00
                    TotalTax: 750.00
                    Total: 5750.00
                    CurrencyCode: NZD
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RepeatingInvoices'
            example:
              Schedule:
                Period: 1
                Unit: MONTHLY
                DueDate: 10
                DueDateType: OFFOLLOWINGMONTH
                StartDate: /Date(1555286400000+0000)/
                EndDate: /Date(1569801600000+0000)/
                NextScheduledDate: /Date(1555286400000+0000)/
              RepeatingInvoiceID: 428c0d75-909f-4b04-8403-a48dc27283b0
              Type: ACCREC
              Reference: '[Week]'
              HasAttachments: true
              ApprovedForSending: false
              SendCopy: false
              MarkAsSent: false
              IncludePDF: false
              ID: 428c0d75-909f-4b04-8403-a48dc27283b0
              Contact:
                ContactID: 430fa14a-f945-44d3-9f97-5df5e28441b8
                Name: Liam Gallagher
                Addresses: []
                Phones: []
                ContactGroups: []
                ContactPersons: []
                HasValidationErrors: false
              Status: DELETED
              LineAmountTypes: Exclusive
              LineItems:
                - Description: Guitars Fender Strat
                  UnitAmount: 5000.00
                  TaxType: OUTPUT2
                  TaxAmount: 750.00
                  LineAmount: 5000.00
                  AccountCode: "200"
                  Tracking: []
                  Quantity: 1.0000
                  LineItemID: 13a8353c-d2af-4d5b-920c-438449f08900
                  DiscountEnteredAsPercent: true
              SubTotal: 5000.00
              TotalTax: 750.00
              Total: 5750.00
              CurrencyCode: NZD
  /RepeatingInvoices/{RepeatingInvoiceID}/Attachments:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getRepeatingInvoiceAttachments
      summary: Retrieves attachments from a specific repeating invoice
      parameters:
        - $ref: '#/components/parameters/RepeatingInvoiceID'
      responses:
        "200":
          description: Success - return response of type Attachments array with all Attachments for a specified Repeating Invoice
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: b88b807b-3087-474b-a4f9-d8f1b4f5a899
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805762049)/
                Attachments:
                  - AttachmentID: 2a488b0f-3966-4b6e-a7e1-b6d3286351f2
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/RepeatingInvoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
                  - AttachmentID: 48294e40-bfd2-4027-a365-f034383cb7aa
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/RepeatingInvoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
                  - AttachmentID: 528e978a-87b8-44c4-9465-9456ec2f7ee6
                    FileName: helo-heros.jpg
                    Url: https://api.xero.com/api.xro/2.0/RepeatingInvoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/helo-heros.jpg
                    MimeType: image/jpeg
                    ContentLength: 2878711
  /RepeatingInvoices/{RepeatingInvoiceID}/Attachments/{AttachmentID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getRepeatingInvoiceAttachmentById
      summary: Retrieves a specific attachment from a specific repeating invoice
      parameters:
        - $ref: '#/components/parameters/RepeatingInvoiceID'
        - $ref: '#/components/parameters/AttachmentID'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Repeating Invoice as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
  /RepeatingInvoices/{RepeatingInvoiceID}/Attachments/{FileName}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.attachments
            - accounting.attachments.read
      tags:
        - Accounting
      operationId: getRepeatingInvoiceAttachmentByFileName
      summary: Retrieves a specific attachment from a specific repeating invoices by file name
      parameters:
        - $ref: '#/components/parameters/RepeatingInvoiceID'
        - $ref: '#/components/parameters/FileName'
        - $ref: '#/components/parameters/ContentType'
      responses:
        "200":
          description: Success - return response of attachment for Repeating Invoice as binary data
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
    post:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: updateRepeatingInvoiceAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Updates a specific attachment from a specific repeating invoices by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/RepeatingInvoiceID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with specified Attachment for a specified Repeating Invoice
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 61b24d5c-4d6e-468f-9de1-abbc234b239a
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805873362)/
                Attachments:
                  - AttachmentID: d086d5f4-9c3d-4edc-a87e-906248eeb652
                    FileName: HelloWorld.jpg
                    Url: https://api.xero.com/api.xro/2.0/RepeatingInvoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/HelloWorld.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
    put:
      security:
        - OAuth2:
            - accounting.attachments
      tags:
        - Accounting
      operationId: createRepeatingInvoiceAttachmentByFileName
      x-hasAccountingValidationError: true
      summary: Creates an attachment from a specific repeating invoices by file name
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/RepeatingInvoiceID'
        - $ref: '#/components/parameters/FileName'
      responses:
        "200":
          description: Success - return response of type Attachments array with updated Attachment for a specified Repeating Invoice
          x-isAttachment: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachments'
              example:
                Id: 219de8c0-ee70-48af-a000-594eba14b417
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553805866696)/
                Attachments:
                  - AttachmentID: e078e56c-9a2b-4f6c-a1fa-5d19b0dab611
                    FileName: foobar.jpg
                    Url: https://api.xero.com/api.xro/2.0/RepeatingInvoices/428c0d75-909f-4b04-8403-a48dc27283b0/Attachments/foobar.jpg
                    MimeType: image/jpg
                    ContentLength: 2878711
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: Byte array of file in body of request
        content:
          application/octet-stream:
            schema:
              type: string
              format: byte
  /RepeatingInvoices/{RepeatingInvoiceID}/History:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.transactions
            - accounting.transactions.read
      tags:
        - Accounting
      operationId: getRepeatingInvoiceHistory
      summary: Retrieves history record for a specific repeating invoice
      parameters:
        - $ref: '#/components/parameters/RepeatingInvoiceID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRetrieved'
    put:
      security:
        - OAuth2:
            - accounting.transactions
      tags:
        - Accounting
      operationId: createRepeatingInvoiceHistory
      summary: Creates a  history record for a specific repeating invoice
      x-hasAccountingValidationError: true
      x-example:
        - historyRecord:
          is_object: true
          key: historyRecord
          keyPascal: HistoryRecord
          keySnake: history_record
        - Details:
          is_last: true
          key: details
          keyPascal: Details
          default: Hello World
          object: historyRecord
        - historyRecords:
          is_object: true
          key: historyRecords
          keyPascal: HistoryRecords
        - add_historyRecord:
          is_last: true
          is_array_add: true
          key: historyRecords
          keyPascal: HistoryRecords
          keySnake: history_records
          java: HistoryRecords
          python: history_record
          ruby: history_record
          csharp: HistoryRecord
          object: historyRecord
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/RepeatingInvoiceID'
      responses:
        "200":
          $ref: '#/components/responses/HistoryRecordCreated'
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        $ref: '#/components/requestBodies/historyRecords'
  /Reports/TenNinetyNine:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
            - accounting.reports.tenninetynine.read
      tags:
        - Accounting
      operationId: getReportTenNinetyNine
      summary: Retrieve reports for 1099
      parameters:
        - in: query
          name: reportYear
          x-snake: report_year
          description: The year of the 1099 report
          example: "2019"
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Reports
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Reports'
              example:
                Id: 8b474ddb-9ef4-457c-8640-1c0e3670ea0e
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1691540171754)/
                Reports:
                  - ReportName: 1099-NEC report
                    ReportDate: 1 Jan 2023 to 31 Dec 2023
                    Fields: []
                    Contacts:
                      - Box1: 0.00
                        Box2: 0.00
                        Box4: 1150.00
                        Name: Bank West
                        FederalTaxIDType: SSN
                        City: Pinehaven
                        Zip: "12345"
                        State: CA
                        Email: jack@bowest.com
                        StreetAddress: "Procurement Services\r\nGPO 1234\r\n\r\n\r\n"
                        TaxID: 234-22-2223
                        ContactId: 81d5706a-8057-4338-8511-747cd85f4c68
                        LegalName: Jack Sparrow
                        BusinessName: Bank West
                        FederalTaxClassification: PARTNERSHIP
                  - ReportName: 1099-MISC report
                    ReportDate: 1 Jan 2023 to 31 Dec 2023
                    Fields: []
                    Contacts:
                      - Box1: 0.00
                        Box2: 0.00
                        Box3: 1000.00
                        Box4: 0.00
                        Box5: 0.00
                        Box6: 0.00
                        Box7: 0.00
                        Box8: 0.00
                        Box9: 0.00
                        Box10: 0.00
                        Box11: 0.00
                        Box14: 0.00
                        Name: Bank West
                        FederalTaxIDType: SSN
                        City: Pinehaven
                        Zip: "12345"
                        State: CA
                        Email: jack@bowest.com
                        StreetAddress: "Procurement Services\r\nGPO 1234\r\n\r\n\r\n"
                        TaxID: 234-22-2223
                        ContactId: 81d5706a-8057-4338-8511-747cd85f4c68
                        LegalName: Jack Sparrow
                        BusinessName: Bank West
                        FederalTaxClassification: PARTNERSHIP
                      - Box1: 0.00
                        Box2: 0.00
                        Box3: 1000.00
                        Box4: 0.00
                        Box5: 0.00
                        Box6: 0.00
                        Box7: 0.00
                        Box8: 0.00
                        Box9: 0.00
                        Box10: 0.00
                        Box11: 0.00
                        Box14: 0.00
                        Name: Hoyt Productions
                        FederalTaxIDType: SSN
                        City: Oaktown
                        Zip: "45123"
                        State: NY
                        Email: accounts@hoytmadeupdemo.com
                        StreetAddress: "100 Rusty Ridge Road\r\nSuite 100\r\n\r\n\r\n"
                        TaxID: 123-45-6780
                        ContactId: 19732b6a-9a5c-4651-b33c-3f8f682e2a2b
                        LegalName: Raymond Holt
                        BusinessName: Hoyt productions
                        FederalTaxClassification: S_CORP
                      - Box1: 5543.75
                        Box2: 0.00
                        Box3: 0.00
                        Box4: 0.00
                        Box5: 0.00
                        Box6: 0.00
                        Box7: 0.00
                        Box8: 0.00
                        Box9: 0.00
                        Box10: 0.00
                        Box11: 0.00
                        Box14: 0.00
                        Name: Truxton Property Management
                        FederalTaxIDType: EIN
                        City: Coppertown
                        Zip: "21321"
                        State: FL
                        Email: accounts@truxtonmadeupdemo.com
                        StreetAddress: "1000 Copper Avenue\r\nSuite 1000\r\n\r\n\r\n"
                        TaxID: 33-3332233
                        ContactId: 018355fc-c67e-4352-b443-ef3873031983
                        LegalName: Jake Peralta
                        BusinessName: Truxton Property Management
                        FederalTaxClassification: C_CORP
  /Reports/AgedPayablesByContact:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportAgedPayablesByContact
      summary: Retrieves report for aged payables by contact
      parameters:
        - in: query
          required: true
          name: contactId
          x-snake: contact_id
          description: Unique identifier for a Contact
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: date
          description: The date of the Aged Payables By Contact report
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: 5a33f9d4-44a6-4467-a812-4f025506ee35
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1555971088085)/
                Reports:
                  - ReportName: Aged Payables By Contact
                    ReportType: AgedPayablesByContact
                    ReportTitles:
                      - Invoices
                      - ABC
                      - From 10 October 2017 to 22 April 2019
                      - Showing payments to 22 April 2019
                    ReportDate: 22 April 2019
                    UpdatedDateUTC: /Date(1555971088085)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: Date
                          - Value: Reference
                          - Value: Due Date
                          - Value: ""
                          - Value: Total
                          - Value: Paid
                          - Value: Credited
                          - Value: Due
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: 2017-10-10T00:00:00
                              - Value: Opening Balance
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "0.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: 2018-10-09T00:00:00
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: ""
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: 2018-10-23T00:00:00
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: 181 days overdue
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: "250.00"
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                              - Value: "250.00"
                                Attributes:
                                  - Value: 1f3960ae-0537-4438-a4dd-76d785e6d7d8
                                    Id: invoiceID
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "250.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "250.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Closing Balance
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "250.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "250.00"
  /Reports/AgedReceivablesByContact:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportAgedReceivablesByContact
      summary: Retrieves report for aged receivables by contact
      parameters:
        - in: query
          required: true
          name: contactId
          x-snake: contact_id
          description: Unique identifier for a Contact
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
            format: uuid
        - in: query
          name: date
          description: The date of the Aged Receivables By Contact report
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: b977b607-955d-47cb-92fd-7c29b3dd755c
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1556032862815)/
                Reports:
                  - ReportName: Aged Receivables By Contact
                    ReportType: AgedReceivablesByContact
                    ReportTitles:
                      - Invoices
                      - ABC
                      - From 10 October 2017 to 23 April 2019
                      - Showing payments to 23 April 2019
                    ReportDate: 23 April 2019
                    UpdatedDateUTC: /Date(1556032862815)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: Date
                          - Value: Number
                          - Value: Due Date
                          - Value: ""
                          - Value: Total
                          - Value: Paid
                          - Value: Credited
                          - Value: Due
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: 2017-10-10T00:00:00
                              - Value: Opening Balance
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "0.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: 2018-05-13T00:00:00
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: IV1242016
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: 2018-06-22T00:00:00
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: 305 days overdue
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: "100.00"
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                              - Value: "100.00"
                                Attributes:
                                  - Value: 40ebad47-24e2-4dc9-a5f5-579df427671b
                                    Id: invoiceID
                          - RowType: Row
                            Cells:
                              - Value: 2019-04-23T00:00:00
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: INV-0086
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: 2019-05-07T00:00:00
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: ""
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: "50.00"
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: "0.00"
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                              - Value: "50.00"
                                Attributes:
                                  - Value: ca0483ce-fa43-4335-8512-751e655337b8
                                    Id: invoiceID
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "150.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "150.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Closing Balance
                              - Value: ""
                              - Value: ""
                              - Value: ""
                              - Value: "150.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "150.00"
  /Reports/BalanceSheet:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportBalanceSheet
      summary: Retrieves report for balancesheet
      parameters:
        - in: query
          name: date
          description: The date of the Balance Sheet report
          example: "2019-11-01"
          schema:
            type: string
            format: date
        - in: query
          name: periods
          description: The number of periods for the Balance Sheet report
          example: 3
          schema:
            type: integer
        - in: query
          name: timeframe
          description: The period size to compare to (MONTH, QUARTER, YEAR)
          example: MONTH
          schema:
            type: string
            enum:
              - MONTH
              - QUARTER
              - YEAR
        - in: query
          name: trackingOptionID1
          x-snake: tracking_option_id_1
          description: The tracking option 1 for the Balance Sheet report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: trackingOptionID2
          x-snake: tracking_option_id_2
          description: The tracking option 2 for the Balance Sheet report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: standardLayout
          x-snake: standard_layout
          description: The standard layout boolean for the Balance Sheet report
          example: true
          x-example-python: "True"
          schema:
            type: boolean
        - in: query
          name: paymentsOnly
          x-snake: payments_only
          description: return a cash basis for the Balance Sheet report
          example: false
          x-example-python: "False"
          schema:
            type: boolean
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: 2ddba304-6ed3-4da4-b185-3b6289699653
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555099412778)/
                Reports:
                  - ReportName: Balance Sheet
                    ReportType: BalanceSheet
                    ReportTitles:
                      - Balance Sheet
                      - Dev Evangelist - Sid Test 3 (NZ-2016-02)
                      - As at 30 April 2019
                    ReportDate: 12 April 2019
                    UpdatedDateUTC: /Date(1555099412778)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: ""
                          - Value: 30 Apr 2019
                          - Value: 31 Mar 2019
                          - Value: 28 Feb 2019
                      - RowType: Section
                        Title: Assets
                        Rows: []
                      - RowType: Section
                        Title: Bank
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Country Savings
                                Attributes:
                                  - Value: 041207d2-3d61-4e5d-8c1a-b9236955a71c
                                    Id: account
                              - Value: "-1850.00"
                                Attributes:
                                  - Value: 041207d2-3d61-4e5d-8c1a-b9236955a71c
                                    Id: account
                              - Value: "-1850.00"
                                Attributes:
                                  - Value: 041207d2-3d61-4e5d-8c1a-b9236955a71c
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 041207d2-3d61-4e5d-8c1a-b9236955a71c
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: My Big Bank
                                Attributes:
                                  - Value: 300f3bde-3a5c-4035-9ec5-45b09777679a
                                    Id: account
                              - Value: "2146.37"
                                Attributes:
                                  - Value: 300f3bde-3a5c-4035-9ec5-45b09777679a
                                    Id: account
                              - Value: "2020.00"
                                Attributes:
                                  - Value: 300f3bde-3a5c-4035-9ec5-45b09777679a
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 300f3bde-3a5c-4035-9ec5-45b09777679a
                                    Id: account
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Bank
                              - Value: "296.37"
                              - Value: "170.00"
                              - Value: "0.00"
                      - RowType: Section
                        Title: Current Assets
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Accounts Receivable
                                Attributes:
                                  - Value: b94495d0-44ab-4199-a1d0-427a4877e100
                                    Id: account
                              - Value: "154355.72"
                                Attributes:
                                  - Value: b94495d0-44ab-4199-a1d0-427a4877e100
                                    Id: account
                              - Value: "154351.78"
                                Attributes:
                                  - Value: b94495d0-44ab-4199-a1d0-427a4877e100
                                    Id: account
                              - Value: "356.50"
                                Attributes:
                                  - Value: b94495d0-44ab-4199-a1d0-427a4877e100
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Inventory
                                Attributes:
                                  - Value: 53a12a15-7e9b-4a31-85f4-a7cee6d04215
                                    Id: account
                              - Value: "25000.00"
                                Attributes:
                                  - Value: 53a12a15-7e9b-4a31-85f4-a7cee6d04215
                                    Id: account
                              - Value: "25000.00"
                                Attributes:
                                  - Value: 53a12a15-7e9b-4a31-85f4-a7cee6d04215
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 53a12a15-7e9b-4a31-85f4-a7cee6d04215
                                    Id: account
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Current Assets
                              - Value: "179355.72"
                              - Value: "179351.78"
                              - Value: "356.50"
                      - RowType: Section
                        Title: Fixed Assets
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Office Equipment
                                Attributes:
                                  - Value: 7132cab3-ce56-4389-8e47-8f60d4c137f8
                                    Id: account
                              - Value: "-119.00"
                                Attributes:
                                  - Value: 7132cab3-ce56-4389-8e47-8f60d4c137f8
                                    Id: account
                              - Value: "-119.00"
                                Attributes:
                                  - Value: 7132cab3-ce56-4389-8e47-8f60d4c137f8
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 7132cab3-ce56-4389-8e47-8f60d4c137f8
                                    Id: account
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Fixed Assets
                              - Value: "-119.00"
                              - Value: "-119.00"
                              - Value: "0.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Assets
                              - Value: "179533.09"
                              - Value: "179402.78"
                              - Value: "356.50"
                      - RowType: Section
                        Title: Liabilities
                        Rows: []
                      - RowType: Section
                        Title: Current Liabilities
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Accounts Payable
                                Attributes:
                                  - Value: a2a4795b-a01f-40eb-afa6-a34b4514875d
                                    Id: account
                              - Value: "-3469.00"
                                Attributes:
                                  - Value: a2a4795b-a01f-40eb-afa6-a34b4514875d
                                    Id: account
                              - Value: "-3469.00"
                                Attributes:
                                  - Value: a2a4795b-a01f-40eb-afa6-a34b4514875d
                                    Id: account
                              - Value: "-184.00"
                                Attributes:
                                  - Value: a2a4795b-a01f-40eb-afa6-a34b4514875d
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: GST
                                Attributes:
                                  - Value: 17d9a4a0-3181-4803-a96b-f0dbe589091b
                                    Id: account
                              - Value: "-2446.21"
                                Attributes:
                                  - Value: 17d9a4a0-3181-4803-a96b-f0dbe589091b
                                    Id: account
                              - Value: "-2461.89"
                                Attributes:
                                  - Value: 17d9a4a0-3181-4803-a96b-f0dbe589091b
                                    Id: account
                              - Value: "76.50"
                                Attributes:
                                  - Value: 17d9a4a0-3181-4803-a96b-f0dbe589091b
                                    Id: account
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Current Liabilities
                              - Value: "-5915.21"
                              - Value: "-5930.89"
                              - Value: "-107.50"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Liabilities
                              - Value: "-5915.21"
                              - Value: "-5930.89"
                              - Value: "-107.50"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Net Assets
                              - Value: "185448.30"
                              - Value: "185333.67"
                              - Value: "464.00"
                      - RowType: Section
                        Title: Equity
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Current Year Earnings
                                Attributes:
                                  - Value: 00000000-0000-0000-0000-000000000000
                                    Id: account
                              - Value: "114.62"
                                Attributes:
                                  - Value: 00000000-0000-0000-0000-000000000000
                                    Id: account
                                  - Value: 4/1/2019
                                    Id: fromDate
                                  - Value: 4/30/2019
                                    Id: toDate
                              - Value: "156621.67"
                                Attributes:
                                  - Value: 00000000-0000-0000-0000-000000000000
                                    Id: account
                                  - Value: 4/1/2018
                                    Id: fromDate
                                  - Value: 3/31/2019
                                    Id: toDate
                              - Value: "500.00"
                                Attributes:
                                  - Value: 00000000-0000-0000-0000-000000000000
                                    Id: account
                                  - Value: 4/1/2018
                                    Id: fromDate
                                  - Value: 2/28/2019
                                    Id: toDate
                          - RowType: Row
                            Cells:
                              - Value: Owner A Drawings
                                Attributes:
                                  - Value: 136ebd08-60ea-4592-8982-be92c153b53a
                                    Id: account
                              - Value: "28752.00"
                                Attributes:
                                  - Value: 136ebd08-60ea-4592-8982-be92c153b53a
                                    Id: account
                              - Value: "28752.00"
                                Attributes:
                                  - Value: 136ebd08-60ea-4592-8982-be92c153b53a
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 136ebd08-60ea-4592-8982-be92c153b53a
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Owner A Funds Introduced
                                Attributes:
                                  - Value: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                                    Id: account
                              - Value: "-50.00"
                                Attributes:
                                  - Value: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                                    Id: account
                              - Value: "-50.00"
                                Attributes:
                                  - Value: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                                    Id: account
                              - Value: "-46.00"
                                Attributes:
                                  - Value: 5690f1e8-1d02-4893-90c2-ee1a69eff942
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Retained Earnings
                                Attributes:
                                  - Value: 7fc16c06-c342-4f32-995f-889b5f9996fd
                                    Id: account
                              - Value: "156631.67"
                                Attributes:
                                  - Value: 7fc16c06-c342-4f32-995f-889b5f9996fd
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 4/30/2019
                                    Id: toDate
                              - Value: "10.00"
                                Attributes:
                                  - Value: 7fc16c06-c342-4f32-995f-889b5f9996fd
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 3/31/2019
                                    Id: toDate
                              - Value: "10.00"
                                Attributes:
                                  - Value: 7fc16c06-c342-4f32-995f-889b5f9996fd
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 2/28/2019
                                    Id: toDate
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Equity
                              - Value: "185448.29"
                              - Value: "185333.67"
                              - Value: "464.00"
  /Reports/BankSummary:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportBankSummary
      summary: Retrieves report for bank summary
      parameters:
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: ae58d0ec-9c5c-455f-b96e-690107579257
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1556035526223)/
                Reports:
                  - ReportName: Bank Summary
                    ReportType: BankSummary
                    ReportTitles:
                      - Bank Summary
                      - MindBody Test 10 (AU-2016-02)
                      - From 1 April 2019 to 30 April 2019
                    ReportDate: 23 April 2019
                    UpdatedDateUTC: /Date(1556035526223)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: Bank Accounts
                          - Value: Opening Balance
                          - Value: Cash Received
                          - Value: Cash Spent
                          - Value: Closing Balance
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Big City Bank
                                Attributes:
                                  - Value: 03f9cf1e-2deb-4bf1-b0a8-b57f08672eb8
                                    Id: accountID
                              - Value: "0.00"
                              - Value: "110.00"
                                Attributes:
                                  - Value: 03f9cf1e-2deb-4bf1-b0a8-b57f08672eb8
                                    Id: account
                              - Value: "100.00"
                                Attributes:
                                  - Value: 03f9cf1e-2deb-4bf1-b0a8-b57f08672eb8
                                    Id: account
                              - Value: "10.00"
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total
                              - Value: "0.00"
                              - Value: "110.00"
                              - Value: "100.00"
                              - Value: "10.00"
  /Reports/{ReportID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportFromId
      summary: Retrieves a specific report using a unique ReportID
      parameters:
        - in: path
          required: true
          name: ReportID
          x-snake: report_id
          description: Unique identifier for a Report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
  /Reports/BudgetSummary:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportBudgetSummary
      summary: Retrieves report for budget summary
      parameters:
        - in: query
          name: date
          description: The date for the Bank Summary report e.g. 2018-03-31
          example: "2019-03-31"
          schema:
            type: string
            format: date
        - in: query
          name: periods
          description: The number of periods to compare (integer between 1 and 12)
          example: 2
          schema:
            type: integer
        - in: query
          name: timeframe
          description: The period size to compare to (1=month, 3=quarter, 12=year)
          example: 3
          schema:
            type: integer
      responses:
        "200":
          description: success- return a Report with Rows object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: 9f1e2722-0d98-4669-890f-f8f4217c968b
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1573755037865)/
                Reports:
                  - ReportName: Budget Summary
                    ReportType: BudgetSummary
                    ReportTitles:
                      - Overall Budget
                      - Budget Summary
                      - Online Test 11
                      - November 2019 to October 2022
                    ReportDate: 14 November 2019
                    UpdatedDateUTC: /Date(1573755037865)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: Account
                          - Value: Jan-20
                          - Value: Apr-20
                          - Value: Jul-20
                          - Value: Oct-20
                          - Value: Jan-21
                          - Value: Apr-21
                          - Value: Jul-21
                          - Value: Oct-21
                          - Value: Jan-22
                          - Value: Apr-22
                          - Value: Jul-22
                          - Value: Oct-22
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Gross Profit
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total Expenses
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Net Profit
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: "0.00"
  /Reports/ExecutiveSummary:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportExecutiveSummary
      summary: Retrieves report for executive summary
      parameters:
        - in: query
          name: date
          description: The date for the Bank Summary report e.g. 2018-03-31
          example: "2019-03-31"
          schema:
            type: string
            format: date
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: 068d3505-ac37-43f3-8135-f912a5963d8a
                Status: OK
                ProviderName: provider-name
                DateTimeUTC: /Date(1573755038314)/
                Reports:
                  - ReportName: Executive Summary
                    ReportType: ExecutiveSummary
                    ReportTitles:
                      - Executive Summary
                      - Online Test 11
                      - For the month of November 2019
                    ReportDate: 14 November 2019
                    UpdatedDateUTC: /Date(1573755038314)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: ""
                          - Value: Nov 2019
                          - Value: Oct 2019
                          - Value: Variance
                      - RowType: Section
                        Title: Cash
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Cash received
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Cash spent
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Cash surplus (deficit)
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Closing bank balance
                              - Value: "79.01"
                              - Value: "79.01"
                              - Value: 0.0%
                      - RowType: Section
                        Title: Profitability
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Income
                              - Value: "40.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Direct costs
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Gross profit (loss)
                              - Value: "40.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Other Income
                              - Value: "0.00"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Expenses
                              - Value: "205.40"
                              - Value: "0.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Profit (loss)
                              - Value: "-165.40"
                              - Value: "0.00"
                              - Value: 0.0%
                      - RowType: Section
                        Title: Balance Sheet
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Debtors
                              - Value: "590.00"
                              - Value: "550.00"
                              - Value: 7.3%
                          - RowType: Row
                            Cells:
                              - Value: Creditors
                              - Value: "-44.00"
                              - Value: "-44.00"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Net assets
                              - Value: "594.16"
                              - Value: "759.56"
                              - Value: -21.8%
                      - RowType: Section
                        Title: Income
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Number of invoices issued
                              - Value: "1"
                              - Value: "0"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Average value of invoices
                              - Value: "40.00"
                              - Value: "0.00"
                              - Value: 0.0%
                      - RowType: Section
                        Title: Performance
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Gross profit margin
                              - Value: 100.0%
                              - Value: ""
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Net profit margin
                              - Value: -413.5%
                              - Value: ""
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Return on investment (p.a.)
                              - Value: -334.1%
                              - Value: 0.0%
                              - Value: 0.0%
                      - RowType: Section
                        Title: Position
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Average debtors days
                              - Value: "442.50"
                              - Value: "0"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Average creditors days
                              - Value: "-6.426484907497565725413826680"
                              - Value: "0"
                              - Value: 0.0%
                          - RowType: Row
                            Cells:
                              - Value: Short term cash forecast
                              - Value: "634.00"
                              - Value: "594.00"
                              - Value: 6.7%
                          - RowType: Row
                            Cells:
                              - Value: Current assets to liabilities
                              - Value: "4.0729764675459012154124644427"
                              - Value: "-62.034024896265560165975103734"
                              - Value: 106.6%
                          - RowType: Row
                            Cells:
                              - Value: Term assets to liabilities
                              - Value: ""
                              - Value: ""
                              - Value: 0.0%
  /Reports:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportsList
      summary: Retrieves a list of the organistaions unique reports that require a uuid to fetch
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
  /Reports/ProfitAndLoss:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportProfitAndLoss
      summary: Retrieves report for profit and loss
      parameters:
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
        - in: query
          name: periods
          description: The number of periods to compare (integer between 1 and 12)
          example: 3
          schema:
            type: integer
        - in: query
          name: timeframe
          description: The period size to compare to (MONTH, QUARTER, YEAR)
          example: MONTH
          schema:
            type: string
            enum:
              - MONTH
              - QUARTER
              - YEAR
        - in: query
          name: trackingCategoryID
          x-snake: tracking_category_id
          description: The trackingCategory 1 for the ProfitAndLoss report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: trackingCategoryID2
          x-snake: tracking_category_id_2
          description: The trackingCategory 2 for the ProfitAndLoss report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: trackingOptionID
          x-snake: tracking_option_id
          description: The tracking option 1 for the ProfitAndLoss report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: trackingOptionID2
          x-snake: tracking_option_id_2
          description: The tracking option 2 for the ProfitAndLoss report
          example: 00000000-0000-0000-0000-000000000000
          schema:
            type: string
        - in: query
          name: standardLayout
          x-snake: standard_layout
          description: Return the standard layout for the ProfitAndLoss report
          example: "true"
          x-example-python: "True"
          schema:
            type: boolean
        - in: query
          name: paymentsOnly
          x-snake: payments_only
          description: Return cash only basis for the ProfitAndLoss report
          example: "false"
          x-example-python: "False"
          schema:
            type: boolean
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
  /Reports/TrialBalance:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.reports.read
      tags:
        - Accounting
      operationId: getReportTrialBalance
      summary: Retrieves report for trial balance
      parameters:
        - in: query
          name: date
          description: The date for the Trial Balance report e.g. 2018-03-31
          example: "2019-10-31"
          schema:
            type: string
            format: date
        - in: query
          name: paymentsOnly
          x-snake: payments_only
          description: Return cash only basis for the Trial Balance report
          example: "true"
          x-example-python: "True"
          schema:
            type: boolean
      responses:
        "200":
          description: Success - return response of type ReportWithRows
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportWithRows'
              example:
                Id: 0b3ee35e-b97c-4b3c-b7e2-9a465233e329
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1556129558740)/
                Reports:
                  - ReportName: Trial Balance
                    ReportType: TrialBalance
                    ReportTitles:
                      - Trial Balance
                      - Dev Evangelist - Sid Test 1 (US-2016-06)
                      - As at 24 April 2019
                    ReportDate: 24 April 2019
                    UpdatedDateUTC: /Date(1556129558724)/
                    Fields: []
                    Rows:
                      - RowType: Header
                        Cells:
                          - Value: Account
                          - Value: Debit
                          - Value: Credit
                          - Value: YTD Debit
                          - Value: YTD Credit
                      - RowType: Section
                        Title: Revenue
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Big Expense (002)
                                Attributes:
                                  - Value: da962997-a8bd-4dff-9616-01cdc199283f
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: da962997-a8bd-4dff-9616-01cdc199283f
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: da962997-a8bd-4dff-9616-01cdc199283f
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: da962997-a8bd-4dff-9616-01cdc199283f
                                    Id: account
                              - Value: "80.00"
                                Attributes:
                                  - Value: da962997-a8bd-4dff-9616-01cdc199283f
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Sales (400)
                                Attributes:
                                  - Value: 02439bca-5fdc-4b62-b281-0bdf9f16fd5b
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 02439bca-5fdc-4b62-b281-0bdf9f16fd5b
                                    Id: account
                              - Value: "200.00"
                                Attributes:
                                  - Value: 02439bca-5fdc-4b62-b281-0bdf9f16fd5b
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 02439bca-5fdc-4b62-b281-0bdf9f16fd5b
                                    Id: account
                              - Value: "1020.22"
                                Attributes:
                                  - Value: 02439bca-5fdc-4b62-b281-0bdf9f16fd5b
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Sales-35325 (1302)
                                Attributes:
                                  - Value: 3f50db14-1fe6-450b-bfe8-b2d894f18c62
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 3f50db14-1fe6-450b-bfe8-b2d894f18c62
                                    Id: account
                              - Value: "1000.00"
                                Attributes:
                                  - Value: 3f50db14-1fe6-450b-bfe8-b2d894f18c62
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 3f50db14-1fe6-450b-bfe8-b2d894f18c62
                                    Id: account
                              - Value: "1000.00"
                                Attributes:
                                  - Value: 3f50db14-1fe6-450b-bfe8-b2d894f18c62
                                    Id: account
                      - RowType: Section
                        Title: Expenses
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Foobar14043 (123)
                                Attributes:
                                  - Value: d1602f69-f900-4616-8d34-90af393fa368
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: d1602f69-f900-4616-8d34-90af393fa368
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: d1602f69-f900-4616-8d34-90af393fa368
                                    Id: account
                              - Value: "40.00"
                                Attributes:
                                  - Value: d1602f69-f900-4616-8d34-90af393fa368
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: d1602f69-f900-4616-8d34-90af393fa368
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: MyExp51937 (1231239)
                                Attributes:
                                  - Value: 90f10e0a-a043-46fe-b87e-630e9a951dae
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 90f10e0a-a043-46fe-b87e-630e9a951dae
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 90f10e0a-a043-46fe-b87e-630e9a951dae
                                    Id: account
                              - Value: "80.00"
                                Attributes:
                                  - Value: 90f10e0a-a043-46fe-b87e-630e9a951dae
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 90f10e0a-a043-46fe-b87e-630e9a951dae
                                    Id: account
                      - RowType: Section
                        Title: Assets
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Accounts Receivable (120)
                                Attributes:
                                  - Value: 31ae5bb4-611c-4f89-a369-86e4d56e90b6
                                    Id: account
                              - Value: "1190.00"
                                Attributes:
                                  - Value: 31ae5bb4-611c-4f89-a369-86e4d56e90b6
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 31ae5bb4-611c-4f89-a369-86e4d56e90b6
                                    Id: account
                              - Value: "36555.04"
                                Attributes:
                                  - Value: 31ae5bb4-611c-4f89-a369-86e4d56e90b6
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 31ae5bb4-611c-4f89-a369-86e4d56e90b6
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Business Wells Fargo (088)
                                Attributes:
                                  - Value: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                                    Id: account
                              - Value: "7639.04"
                                Attributes:
                                  - Value: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 6f7594f2-f059-4d56-9e67-47ac9733bfe9
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Generic Cash Clearing (8003)
                                Attributes:
                                  - Value: f4be973a-25fc-48d0-a7df-7f719f239729
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: f4be973a-25fc-48d0-a7df-7f719f239729
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f4be973a-25fc-48d0-a7df-7f719f239729
                                    Id: account
                              - Value: "1443.00"
                                Attributes:
                                  - Value: f4be973a-25fc-48d0-a7df-7f719f239729
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f4be973a-25fc-48d0-a7df-7f719f239729
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Generic Credit Card Clearing (8002)
                                Attributes:
                                  - Value: a10867ac-0bc4-4aa5-af00-b9e5b207c6c3
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: a10867ac-0bc4-4aa5-af00-b9e5b207c6c3
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: a10867ac-0bc4-4aa5-af00-b9e5b207c6c3
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: a10867ac-0bc4-4aa5-af00-b9e5b207c6c3
                                    Id: account
                              - Value: "96.49"
                                Attributes:
                                  - Value: a10867ac-0bc4-4aa5-af00-b9e5b207c6c3
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Generic Inventory (1400)
                                Attributes:
                                  - Value: 7422f1b6-619f-488c-89e1-91bdde20216c
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 7422f1b6-619f-488c-89e1-91bdde20216c
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 7422f1b6-619f-488c-89e1-91bdde20216c
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 7422f1b6-619f-488c-89e1-91bdde20216c
                                    Id: account
                              - Value: "160.00"
                                Attributes:
                                  - Value: 7422f1b6-619f-488c-89e1-91bdde20216c
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: My Savings (090)
                                Attributes:
                                  - Value: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                                    Id: account
                              - Value: "219.92"
                                Attributes:
                                  - Value: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 7e5e243b-9fcd-4aef-8e3a-c70be1e39bfa
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Payment Wall Clearing Account (8001)
                                Attributes:
                                  - Value: bc06840c-12c5-4e22-bb57-fef4d64bac10
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: bc06840c-12c5-4e22-bb57-fef4d64bac10
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: bc06840c-12c5-4e22-bb57-fef4d64bac10
                                    Id: account
                              - Value: "1.00"
                                Attributes:
                                  - Value: bc06840c-12c5-4e22-bb57-fef4d64bac10
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: bc06840c-12c5-4e22-bb57-fef4d64bac10
                                    Id: account
                      - RowType: Section
                        Title: Liabilities
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Accounts Payable (200)
                                Attributes:
                                  - Value: e9132ee7-4dcf-4fad-b76c-86e212af645a
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: e9132ee7-4dcf-4fad-b76c-86e212af645a
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: e9132ee7-4dcf-4fad-b76c-86e212af645a
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: e9132ee7-4dcf-4fad-b76c-86e212af645a
                                    Id: account
                              - Value: "9223.00"
                                Attributes:
                                  - Value: e9132ee7-4dcf-4fad-b76c-86e212af645a
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Deferred Revenue (2300)
                                Attributes:
                                  - Value: f22cd74e-f59d-4f38-a08d-07e14df28c24
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f22cd74e-f59d-4f38-a08d-07e14df28c24
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: f22cd74e-f59d-4f38-a08d-07e14df28c24
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f22cd74e-f59d-4f38-a08d-07e14df28c24
                                    Id: account
                              - Value: "1854.24"
                                Attributes:
                                  - Value: f22cd74e-f59d-4f38-a08d-07e14df28c24
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Rounding (260)
                                Attributes:
                                  - Value: f0072999-8f7c-4b01-bce9-bd9352f98e02
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f0072999-8f7c-4b01-bce9-bd9352f98e02
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: f0072999-8f7c-4b01-bce9-bd9352f98e02
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: f0072999-8f7c-4b01-bce9-bd9352f98e02
                                    Id: account
                              - Value: "0.01"
                                Attributes:
                                  - Value: f0072999-8f7c-4b01-bce9-bd9352f98e02
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Sales Tax (220)
                                Attributes:
                                  - Value: af0be362-45fe-4730-a8af-634c2fb93f4d
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: af0be362-45fe-4730-a8af-634c2fb93f4d
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: af0be362-45fe-4730-a8af-634c2fb93f4d
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: af0be362-45fe-4730-a8af-634c2fb93f4d
                                    Id: account
                              - Value: "1578.35"
                                Attributes:
                                  - Value: af0be362-45fe-4730-a8af-634c2fb93f4d
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Suspense (250)
                                Attributes:
                                  - Value: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                                    Id: account
                              - Value: "10.00"
                                Attributes:
                                  - Value: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                                    Id: account
                              - Value: "41.00"
                                Attributes:
                                  - Value: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 5ec2f302-cd60-4f8b-a915-9229dd45e6fa
                                    Id: account
                          - RowType: Row
                            Cells:
                              - Value: Unpaid Expense Claims (210)
                                Attributes:
                                  - Value: 38e6967d-4da1-4a93-85f1-ea3c93b61041
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 38e6967d-4da1-4a93-85f1-ea3c93b61041
                                    Id: account
                              - Value: "0.00"
                                Attributes:
                                  - Value: 38e6967d-4da1-4a93-85f1-ea3c93b61041
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 38e6967d-4da1-4a93-85f1-ea3c93b61041
                                    Id: account
                              - Value: "135.00"
                                Attributes:
                                  - Value: 38e6967d-4da1-4a93-85f1-ea3c93b61041
                                    Id: account
                      - RowType: Section
                        Title: Equity
                        Rows:
                          - RowType: Row
                            Cells:
                              - Value: Retained Earnings (320)
                                Attributes:
                                  - Value: 6ef53919-b47d-4341-b11a-735a3f8a6515
                                    Id: account
                              - Value: ""
                                Attributes:
                                  - Value: 6ef53919-b47d-4341-b11a-735a3f8a6515
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 12/31/2018
                                    Id: toDate
                              - Value: "0.00"
                                Attributes:
                                  - Value: 6ef53919-b47d-4341-b11a-735a3f8a6515
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 12/31/2018
                                    Id: toDate
                              - Value: ""
                                Attributes:
                                  - Value: 6ef53919-b47d-4341-b11a-735a3f8a6515
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 12/31/2018
                                    Id: toDate
                              - Value: "30871.69"
                                Attributes:
                                  - Value: 6ef53919-b47d-4341-b11a-735a3f8a6515
                                    Id: account
                                  - Value: ""
                                    Id: fromDate
                                  - Value: 12/31/2018
                                    Id: toDate
                      - RowType: Section
                        Title: ""
                        Rows:
                          - RowType: SummaryRow
                            Cells:
                              - Value: Total
                              - Value: "1200.00"
                              - Value: "1200.00"
                              - Value: "46019.00"
                              - Value: "46019.00"
  /Setup:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: postSetup
      summary: Sets the chart of accounts, the conversion date and conversion balances
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-example:
        - account:
          is_object: true
          key: account
          keyPascal: Account
        - code:
          key: code
          keyPascal: Code
          default: 123
          object: account
        - name:
          key: name
          keyPascal: Name
          default: Business supplies
          object: account
        - type:
          is_last: true
          key: type
          keyPascal: Type
          default: EXPENSE
          nonString: true
          php: XeroAPI\XeroPHP\Models\Accounting\AccountType::EXPENSE
          node: AccountType.EXPENSE
          ruby: XeroRuby::Accounting::AccountType::EXPENSE
          python: AccountType.EXPENSE
          java: com.xero.models.accounting.AccountType.EXPENSE
          csharp: AccountType.EXPENSE
          object: account
        - accounts:
          is_list: true
          key: accounts
          keyPascal: Account
        - add_accounts:
          is_last: true
          is_list_add: true
          key: accounts
          keyPascal: Accounts
          object: account
        - conversionDate:
          is_object: true
          key: conversionDate
          keyPascal: ConversionDate
          keySnake: conversion_date
        - month:
          nonString: true
          key: month
          keyPascal: Month
          default: 10
          object: conversionDate
        - year:
          is_last: true
          nonString: true
          key: year
          keyPascal: Year
          default: 2020
          object: conversionDate
        - conversionBalances:
          is_list: true
          key: conversionBalances
          keyPascal: ConversionBalances
          keySnake: conversion_balances
        - Setup:
          is_object: true
          key: setup
          keyPascal: Setup
        - set_accounts:
          is_variable: true
          nonString: true
          key: accounts
          keyPascal: Accounts
          default: accounts
          object: setup
        - set_conversionDate:
          is_variable: true
          nonString: true
          key: conversionDate
          keyPascal: ConversionDate
          keySnake: conversion_date
          default: conversionDate
          python: conversion_date
          ruby: conversion_date
          object: setup
        - set_conversionBalances:
          is_last: true
          is_variable: true
          nonString: true
          key: conversionBalances
          keyPascal: ConversionBalances
          keySnake: conversion_balances
          default: conversionBalances
          python: conversion_balances
          ruby: conversion_balances
          object: setup
      responses:
        "200":
          description: Success - returns a summary of the chart of accounts updates
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImportSummaryObject'
              example:
                Id: 80dcb65b-4d14-4350-84e6-1438a809244a
                Status: OK
                ProviderName: Java Public Example
                DateTimeUTC: /Date(1604457589645)/
                ImportSummary:
                  Accounts:
                    Total: 17
                    New: 0
                    Updated: 8
                    Deleted: 0
                    Locked: 0
                    System: 9
                    Errored: 0
                    Present: true
                    NewOrUpdated: 8
                  Organisation:
                    Present: false
      requestBody:
        required: true
        description: Object including an accounts array, a conversion balances array and a conversion date object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Setup'
            example:
              ConversionDate: {}
              ConversionBalances: []
              Accounts:
                - Code: "200"
                  Name: Sales
                  Type: SALES
                  ReportingCode: REV.TRA.GOO
                - Code: "400"
                  Name: Advertising
                  Type: OVERHEADS
                  ReportingCode: EXP
                - Code: "610"
                  Name: Accounts Receivable
                  Type: CURRENT
                  SystemAccount: DEBTORS
                  ReportingCode: ASS.CUR.REC.TRA
                - Code: "800"
                  Name: Accounts Payable
                  Type: CURRLIAB
                  SystemAccount: CREDITORS
                  ReportingCode: LIA.CUR.PAY
  /TaxRates:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getTaxRates
      summary: Retrieves tax rates
      parameters:
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="ACTIVE"
          x-example-csharp: Status==\"ACTIVE\"
          x-example-java: Status==&quot;&apos; + TaxRate.StatusEnum.ACTIVE + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\TaxRate::STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::TaxRate::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Name ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type TaxRates array with TaxRates
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaxRates'
              example:
                Id: 455d494d-9706-465b-b584-7086ca406b27
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555086839841)/
                TaxRates:
                  - Name: 15% GST on Expenses
                    TaxType: INPUT2
                    ReportTaxType: INPUT
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: true
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: false
                    DisplayTaxRate: 15.0000
                    EffectiveRate: 15.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 15.0000
                        IsCompound: false
                        IsNonRecoverable: false
                  - Name: 15% GST on Income
                    TaxType: OUTPUT2
                    ReportTaxType: OUTPUT
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: false
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: true
                    DisplayTaxRate: 15.0000
                    EffectiveRate: 15.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 15.0000
                        IsCompound: false
                        IsNonRecoverable: false
                  - Name: GST on Imports
                    TaxType: GSTONIMPORTS
                    ReportTaxType: GSTONIMPORTS
                    CanApplyToAssets: false
                    CanApplyToEquity: false
                    CanApplyToExpenses: false
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: false
                    DisplayTaxRate: 0.0000
                    EffectiveRate: 0.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 0.0000
                        IsCompound: false
                        IsNonRecoverable: false
                  - Name: No GST
                    TaxType: NONE
                    ReportTaxType: NONE
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: true
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: true
                    DisplayTaxRate: 0.0000
                    EffectiveRate: 0.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 0.0000
                        IsCompound: false
                        IsNonRecoverable: false
                  - Name: Zero Rated
                    TaxType: ZERORATED
                    ReportTaxType: OUTPUT
                    CanApplyToAssets: false
                    CanApplyToEquity: false
                    CanApplyToExpenses: false
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: true
                    DisplayTaxRate: 0.0000
                    EffectiveRate: 0.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 0.0000
                        IsCompound: false
                        IsNonRecoverable: false
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createTaxRates
      summary: Creates one or more tax rates
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - taxComponent:
          is_object: true
          key: taxComponent
          keyPascal: TaxComponent
          keySnake: tax_component
        - name:
          key: name
          keyPascal: Name
          default: State Tax
          object: taxComponent
        - rate:
          is_last: true
          nonString: true
          key: rate
          keyPascal: Rate
          default: 2.25
          is_money: true
          object: taxComponent
        - taxComponents:
          is_list: true
          key: taxComponent
          keyPascal: TaxComponent
          csharp: TaxComponent
        - add_taxComponent:
          is_last: true
          is_list_add: true
          key: taxComponents
          keyPascal: TaxComponents
          keySnake: tax_components
          java: TaxComponents
          python: tax_component
          ruby: tax_component
          csharp: TaxComponent
          object: taxComponent
        - taxRate:
          is_object: true
          key: taxRate
          keyPascal: TaxRate
          keySnake: tax_rate
        - name:
          key: name
          keyPascal: Name
          default: CA State Tax
          object: taxRate
        - set_taxComponents:
          is_variable: true
          nonString: true
          key: taxComponents
          keyPascal: TaxComponents
          object: taxRate
          default: taxComponents
        - taxRates:
          is_object: true
          key: taxRates
          keyPascal: TaxRates
        - add_taxRate:
          is_last: true
          is_array_add: true
          key: taxRates
          keyPascal: TaxRates
          keySnake: tax_rates
          java: TaxRates
          python: tax_rate
          ruby: tax_rate
          csharp: TaxRate
          object: taxRate
      responses:
        "200":
          description: Success - return response of type TaxRates array newly created TaxRate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaxRates'
              example:
                Id: 9d2c5e56-fab4-450b-a5ff-d47409508eab
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555086839080)/
                TaxRates:
                  - Name: SDKTax29067
                    TaxType: TAX002
                    ReportTaxType: INPUT
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: true
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: false
                    DisplayTaxRate: 2.2500
                    EffectiveRate: 2.2500
                    Status: ACTIVE
                    TaxComponents:
                      - Name: State Tax
                        Rate: 2.2500
                        IsCompound: false
                        IsNonRecoverable: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: TaxRates array with TaxRate object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaxRates'
            example:
              TaxRates:
                - Name: CA State Tax
                  TaxComponents:
                    - Name: State Tax
                      Rate: 2.25
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateTaxRate
      summary: Updates tax rates
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - taxComponent:
          is_object: true
          key: taxComponent
          keyPascal: TaxComponent
          keySnake: tax_component
        - name:
          key: name
          keyPascal: Name
          default: State Tax
          object: taxComponent
        - rate:
          is_last: true
          nonString: true
          key: rate
          keyPascal: Rate
          default: 2.25
          is_money: true
          object: taxComponent
        - taxComponents:
          is_list: true
          key: taxComponents
          keyPascal: TaxComponents
          csharp: TaxComponent
        - add_taxComponent:
          is_last: true
          is_list_add: true
          key: taxComponents
          keyPascal: TaxComponents
          keySnake: tax_components
          java: TaxComponents
          python: tax_component
          ruby: tax_component
          csharp: TaxComponent
          object: taxComponent
        - taxRate:
          is_object: true
          key: taxRate
          keyPascal: TaxRate
          keySnake: tax_rate
        - name:
          key: name
          keyPascal: Name
          default: CA State Tax
          object: taxRate
        - set_taxComponents:
          is_variable: true
          nonString: true
          key: taxComponents
          keyPascal: TaxComponents
          object: taxRate
          default: taxComponents
        - taxRates:
          is_object: true
          key: taxRates
          keyPascal: TaxRates
        - add_taxRate:
          is_last: true
          is_array_add: true
          key: taxRates
          keyPascal: TaxRates
          keySnake: tax_rates
          java: TaxRates
          python: tax_rate
          ruby: tax_rate
          csharp: TaxRate
          object: taxRate
      responses:
        "200":
          description: Success - return response of type TaxRates array updated TaxRate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaxRates'
              example:
                Id: 12f4c453-2e25-41aa-a52f-6faaf6c05832
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555086839658)/
                TaxRates:
                  - Name: SDKTax29067
                    TaxType: TAX002
                    ReportTaxType: INPUT
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: true
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: false
                    DisplayTaxRate: 2.2500
                    EffectiveRate: 2.2500
                    Status: DELETED
                    TaxComponents:
                      - Name: State Tax
                        Rate: 2.2500
                        IsCompound: false
                        IsNonRecoverable: false
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaxRates'
            example:
              TaxRates:
                - Name: State Tax NY
                  TaxComponents:
                    - Name: State Tax
                      Rate: 2.25
                  Status: DELETED
                  ReportTaxType: INPUT
  /TaxRates/{TaxType}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getTaxRateByTaxType
      summary: Retrieves a specific tax rate according to given TaxType code
      parameters:
        - $ref: '#/components/parameters/TaxType'
      responses:
        "200":
          description: Success - return response of type TaxRates array with one TaxRate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaxRates'
              example:
                Id: 455d494d-9706-465b-b584-7086ca406b27
                Status: OK
                ProviderName: Xero API Partner
                DateTimeUTC: /Date(1550797359081)/
                TaxRates:
                  - Name: 15% GST on Expenses
                    TaxType: INPUT2
                    ReportTaxType: INPUT
                    CanApplyToAssets: true
                    CanApplyToEquity: true
                    CanApplyToExpenses: true
                    CanApplyToLiabilities: true
                    CanApplyToRevenue: false
                    DisplayTaxRate: 15.0000
                    EffectiveRate: 15.0000
                    Status: ACTIVE
                    TaxComponents:
                      - Name: GST
                        Rate: 15.0000
                        IsCompound: false
                        IsNonRecoverable: false
  /TrackingCategories:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getTrackingCategories
      summary: Retrieves tracking categories and options
      parameters:
        - in: query
          name: where
          description: Filter by an any element
          example: Status=="ACTIVE"
          x-example-csharp: Status==\"ACTIVE\"
          x-example-java: Status==&quot;&apos; + TrackingCategory.StatusEnum.ACTIVE + &apos;&quot;
          x-example-php: Status==&quot;&apos; . \XeroAPI\XeroPHP\Models\Accounting\TrackingCategory::STATUS_ACTIVE . &apos;&quot;
          x-example-ruby: Status==#{XeroRuby::Accounting::TrackingCategory::ACTIVE}
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: Name ASC
          schema:
            type: string
        - in: query
          name: includeArchived
          x-snake: include_archived
          description: e.g. includeArchived=true - Categories and options with a status of ARCHIVED will be included in the response
          example: true
          x-example-python: "True"
          schema:
            type: boolean
      responses:
        "200":
          description: Success - return response of type TrackingCategories array of TrackingCategory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingCategories'
              example:
                Id: cec55068-8061-48e5-ac83-c77e7c54cf3d
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085855047)/
                TrackingCategories:
                  - Name: BarFoo
                    Status: ACTIVE
                    TrackingCategoryID: 22f10184-0deb-44ae-a312-b1f6ea70e51f
                    Options: []
                  - Name: HelloWorld
                    Status: ACTIVE
                    TrackingCategoryID: 0c9fce3e-a111-4d99-803a-62cf3f40e633
                    Options: []
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createTrackingCategory
      summary: Create tracking categories
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
      x-hasAccountingValidationError: true
      x-example:
        - trackingCategory:
          is_object: true
          key: trackingCategory
          keyPascal: TrackingCategory
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: Foobar
          object: trackingCategory
      responses:
        "200":
          description: Success - return response of type TrackingCategories array of newly created TrackingCategory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingCategories'
              example:
                Id: 1a9f8e03-9916-4a42-93a9-e8fa4902d49c
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085855988)/
                TrackingCategories:
                  - Name: FooBar
                    Status: ACTIVE
                    TrackingCategoryID: b1df776b-b093-4730-b6ea-590cca40e723
                    Options: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: TrackingCategory object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TrackingCategory'
            example:
              name: FooBar
  /TrackingCategories/{TrackingCategoryID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getTrackingCategory
      summary: Retrieves specific tracking categories and options using a unique tracking category Id
      parameters:
        - $ref: '#/components/parameters/TrackingCategoryID'
      responses:
        "200":
          description: Success - return response of type TrackingCategories array of specified TrackingCategory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingCategories'
              example:
                Id: b75b8862-39c0-45a8-82b8-30ab4831996b
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085855442)/
                TrackingCategories:
                  - Name: Foo41157
                    Status: DELETED
                    TrackingCategoryID: 22f10184-0deb-44ae-a312-b1f6ea70e51f
                    Options: []
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateTrackingCategory
      summary: Updates a specific tracking category
      x-hasAccountingValidationError: true
      x-example:
        - trackingCategory:
          is_object: true
          key: trackingCategory
          keyPascal: TrackingCategory
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: Foobar
          object: trackingCategory
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/TrackingCategoryID'
      responses:
        "200":
          description: Success - return response of type TrackingCategories array of updated TrackingCategory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingCategories'
              example:
                Id: 55438774-f87d-4731-b586-799cf0f914ed
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085856275)/
                TrackingCategories:
                  - Name: BarFoo
                    Status: ACTIVE
                    TrackingCategoryID: b1df776b-b093-4730-b6ea-590cca40e723
                    Options: []
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TrackingCategory'
            example:
              Name: Avengers
    delete:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: deleteTrackingCategory
      summary: Deletes a specific tracking category
      parameters:
        - $ref: '#/components/parameters/TrackingCategoryID'
      responses:
        "200":
          description: Success - return response of type TrackingCategories array of deleted TrackingCategory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingCategories'
              example:
                Id: ca7f8145-c8a5-4366-a2fb-784edc0cfbb7
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555086457922)/
                TrackingCategories:
                  - Name: Foo46189
                    Status: DELETED
                    TrackingCategoryID: 0390bdfd-94f2-49d6-b7a0-4a38c46ebf03
                    Options: []
        "400":
          $ref: '#/components/responses/400Error'
  /TrackingCategories/{TrackingCategoryID}/Options:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    put:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: createTrackingOptions
      summary: Creates options for a specific tracking category
      x-hasAccountingValidationError: true
      x-example:
        - trackingOption:
          is_object: true
          key: trackingOption
          keyPascal: TrackingOption
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: Foobar
          object: trackingOption
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/TrackingCategoryID'
      responses:
        "200":
          description: Success - return response of type TrackingOptions array of options for a specified category
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingOptions'
              example:
                Id: 923be702-d124-4f5c-a568-760906538d8e
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085857061)/
                Options:
                  - TrackingOptionID: 34669548-b989-487a-979f-0787d04568a2
                    Name: Bar40423
                    Status: ACTIVE
                    HasValidationErrors: false
                    IsDeleted: false
                    IsArchived: false
                    IsActive: true
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        description: TrackingOption object in body of request
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TrackingOption'
            example:
              name: ' Bar'
  /TrackingCategories/{TrackingCategoryID}/Options/{TrackingOptionID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    post:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: updateTrackingOptions
      summary: Updates a specific option for a specific tracking category
      x-hasAccountingValidationError: true
      x-example:
        - trackingOption:
          is_object: true
          key: trackingOption
          keyPascal: TrackingOption
        - name:
          is_last: true
          key: name
          keyPascal: Name
          default: Foobar
          object: trackingOption
      parameters:
        - $ref: '#/components/parameters/idempotencyKey'
        - $ref: '#/components/parameters/TrackingCategoryID'
        - $ref: '#/components/parameters/TrackingOptionID'
      responses:
        "200":
          description: Success - return response of type TrackingOptions array of options for a specified category
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingOptions'
              example:
                Id: 923be702-d124-4f5c-a568-760906538d8e
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085857061)/
                Options:
                  - TrackingOptionID: 34669548-b989-487a-979f-0787d04568a2
                    Name: Bar40423
                    Status: ACTIVE
                    HasValidationErrors: false
                    IsDeleted: false
                    IsArchived: false
                    IsActive: true
        "400":
          $ref: '#/components/responses/400Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TrackingOption'
            example:
              name: Vision
    delete:
      security:
        - OAuth2:
            - accounting.settings
      tags:
        - Accounting
      operationId: deleteTrackingOptions
      summary: Deletes a specific option for a specific tracking category
      parameters:
        - $ref: '#/components/parameters/TrackingCategoryID'
        - $ref: '#/components/parameters/TrackingOptionID'
      responses:
        "200":
          description: Success - return response of type TrackingOptions array of remaining options for a specified category
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrackingOptions'
              example:
                Id: d985866e-0831-418f-a07c-4d843ff66d25
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1555085857338)/
                Options:
                  - TrackingOptionID: 34669548-b989-487a-979f-0787d04568a2
                    Name: Bar40423
                    Status: DELETED
                    HasValidationErrors: false
                    IsDeleted: true
                    IsArchived: false
                    IsActive: false
        "400":
          $ref: '#/components/responses/400Error'
  /Users:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getUsers
      summary: Retrieves users
      parameters:
        - $ref: '#/components/parameters/ifModifiedSince'
        - in: query
          name: where
          description: Filter by an any element
          example: IsSubscriber==true
          schema:
            type: string
        - in: query
          name: order
          description: Order by an any element
          example: LastName ASC
          schema:
            type: string
      responses:
        "200":
          description: Success - return response of type Users array of all User
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Users'
              example:
                Id: 17932a4e-4948-4d50-8672-4ef0e1dd90c5
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553880796393)/
                Users:
                  - UserID: 3c37ef1d-cd49-4589-9787-3c418ed8b6ac
                    EmailAddress: test@email.com
                    FirstName: Test
                    LastName: Xero
                    UpdatedDateUTC: /Date(1508523261613+0000)/
                    IsSubscriber: false
                    OrganisationRole: FINANCIALADVISER
                  - UserID: d1164823-0ac1-41ad-987b-b4e30fe0b273
                    EmailAddress: api@xero.com
                    FirstName: 'API '
                    LastName: Team
                    UpdatedDateUTC: /Date(1511957179217+0000)/
                    IsSubscriber: true
                    OrganisationRole: FINANCIALADVISER
  /Users/{UserID}:
    parameters:
      - $ref: '#/components/parameters/requiredHeader'
    get:
      security:
        - OAuth2:
            - accounting.settings
            - accounting.settings.read
      tags:
        - Accounting
      operationId: getUser
      summary: Retrieves a specific user
      parameters:
        - $ref: '#/components/parameters/UserID'
      responses:
        "200":
          description: Success - return response of type Users array of specified User
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Users'
              example:
                Id: 51250ce8-1b35-4ba4-b404-dc94ff75bd87
                Status: OK
                ProviderName: Provider Name Example
                DateTimeUTC: /Date(1553880796732)/
                Users:
                  - UserID: 3c37ef1d-cd49-4589-9787-3c418ed8b6ac
                    EmailAddress: test@email.com
                    FirstName: Test
                    LastName: Xero
                    UpdatedDateUTC: /Date(1508523261613+0000)/
                    IsSubscriber: false
                    OrganisationRole: FINANCIALADVISER
components:
  securitySchemes:
    OAuth2:
      type: oauth2
      description: For more information
      flows:
        authorizationCode:
          authorizationUrl: https://login.xero.com/identity/connect/authorize
          tokenUrl: https://identity.xero.com/connect/token
          scopes:
            email: Grant read-only access to your email
            openid: Grant read-only access to your open id
            profile: your profile information
            accounting.attachments: Grant read-write access to attachments
            accounting.attachments.read: Grant read-only access to attachments
            accounting.contacts: Grant read-write access to contacts and contact groups
            accounting.contacts.read: Grant read-only access to contacts and contact groups
            accounting.journals.read: Grant read-only access to journals
            accounting.reports.read: Grant read-only access to accounting reports
            accounting.reports.tenninetynine.read: Grant read-only access to 1099 reports
            accounting.settings: Grant read-write access to organisation and account settings
            accounting.settings.read: Grant read-only access to organisation and account settings
            accounting.transactions: Grant read-write access to bank transactions, credit notes, invoices, repeating invoices
            accounting.transactions.read: Grant read-only access to invoices
            paymentservices: Grant read-write access to payment services
  requestBodies:
    historyRecords:
      required: true
      description: HistoryRecords containing an array of HistoryRecord objects in body of request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/HistoryRecords'
          example:
            HistoryRecords:
              - Details: Hello World
  parameters:
    requiredHeader:
      in: header
      name: xero-tenant-id
      x-snake: xero_tenant_id
      description: Xero identifier for Tenant
      example: YOUR_XERO_TENANT_ID
      schema:
        type: string
      required: true
    summarizeErrors:
      in: query
      name: summarizeErrors
      x-snake: summarize_errors
      description: If false return 200 OK and mix of successfully created objects and any with validation errors
      example: true
      x-example-python: "True"
      schema:
        type: boolean
        default: false
    unitdp:
      in: query
      name: unitdp
      description: e.g. unitdp=4 – (Unit Decimal Places) You can opt in to use four decimal places for unit amounts
      example: 4
      schema:
        type: integer
    ifModifiedSince:
      in: header
      name: If-Modified-Since
      x-snake: if_modified_since
      description: Only records created or modified since this timestamp will be returned
      example: "2020-02-06T12:17:43.202-08:00"
      schema:
        type: string
        format: date-time
    idempotencyKey:
      in: header
      name: Idempotency-Key
      x-snake: idempotency_key
      description: This allows you to safely retry requests without the risk of duplicate processing. 128 character max.
      example: KEY_VALUE
      schema:
        type: string
    includeOnline:
      in: query
      name: IncludeOnline
      x-snake: include_online
      description: Allows an attachment to be seen by the end customer within their online invoice
      example: true
      x-example-python: "True"
      schema:
        type: boolean
        default: false
    summaryOnly:
      in: query
      name: summaryOnly
      x-snake: summary_only
      description: Use summaryOnly=true in GET Contacts and Invoices endpoint to retrieve a smaller version of the response object. This returns only lightweight fields, excluding computation-heavy fields from the response, making the API calls quick and efficient.
      example: true
      x-example-python: "True"
      schema:
        type: boolean
        default: false
    searchTerm:
      in: query
      name: searchTerm
      x-snake: search_term
      description: Search parameter that performs a case-insensitive text search across the fields e.g. InvoiceNumber, Reference.
      example: SearchTerm=REF12
      x-example-python: "True"
      schema:
        type: string
    FromDate:
      in: query
      name: fromDate
      x-snake: from_date
      description: filter by the from date of the report e.g. 2021-02-01
      example: "2019-10-31"
      schema:
        type: string
        format: date
    ToDate:
      in: query
      name: toDate
      x-snake: to_date
      description: filter by the to date of the report e.g. 2021-02-28
      example: "2019-10-31"
      schema:
        type: string
        format: date
    pageSize:
      in: query
      name: pageSize
      description: Number of records to retrieve per page
      example: 100
      schema:
        type: integer
    AccountID:
      required: true
      in: path
      name: AccountID
      x-snake: account_id
      description: Unique identifier for Account object
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    AllocationID:
      required: true
      in: path
      name: AllocationID
      x-snake: allocation_id
      description: Unique identifier for Allocation object
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    AttachmentID:
      required: true
      in: path
      name: AttachmentID
      x-snake: attachment_id
      description: Unique identifier for Attachment object
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ContentType:
      required: true
      in: header
      name: contentType
      x-snake: content_type
      description: The mime type of the attachment file you are retrieving i.e image/jpg, application/pdf
      example: image/jpg
      schema:
        type: string
    FileName:
      required: true
      in: path
      name: FileName
      x-snake: file_name
      description: Name of the attachment
      example: xero-dev.jpg
      schema:
        type: string
    BatchPaymentID:
      required: true
      in: path
      name: BatchPaymentID
      x-snake: batch_payment_id
      description: Unique identifier for BatchPayment
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    BankTransactionID:
      required: true
      in: path
      name: BankTransactionID
      x-snake: bank_transaction_id
      description: Xero generated unique identifier for a bank transaction
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    BankTransferID:
      required: true
      in: path
      name: BankTransferID
      x-snake: bank_transfer_id
      description: Xero generated unique identifier for a bank transfer
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    BrandingThemeID:
      required: true
      in: path
      name: BrandingThemeID
      x-snake: branding_theme_id
      description: Unique identifier for a Branding Theme
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    BudgetID:
      required: true
      in: path
      name: BudgetID
      x-snake: budget_id
      description: Unique identifier for Budgets
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ContactID:
      required: true
      in: path
      name: ContactID
      x-snake: contact_id
      description: Unique identifier for a Contact
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ContactGroupID:
      required: true
      in: path
      name: ContactGroupID
      x-snake: contact_group_id
      description: Unique identifier for a Contact Group
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    CreditNoteID:
      required: true
      in: path
      name: CreditNoteID
      x-snake: credit_note_id
      description: Unique identifier for a Credit Note
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    EmployeeID:
      required: true
      in: path
      name: EmployeeID
      x-snake: employee_id
      description: Unique identifier for a Employee
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ExpenseClaimID:
      required: true
      in: path
      name: ExpenseClaimID
      x-snake: expense_claim_id
      description: Unique identifier for a ExpenseClaim
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    InvoiceID:
      required: true
      in: path
      name: InvoiceID
      x-snake: invoice_id
      description: Unique identifier for an Invoice
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ItemID:
      required: true
      in: path
      name: ItemID
      x-snake: item_id
      description: Unique identifier for an Item
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    JournalID:
      required: true
      in: path
      name: JournalID
      x-snake: journal_id
      description: Unique identifier for a Journal
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    JournalNumber:
      required: true
      in: path
      name: JournalNumber
      x-snake: journal_number
      description: Number of a Journal
      example: 1000
      schema:
        type: integer
    LinkedTransactionID:
      required: true
      in: path
      name: LinkedTransactionID
      x-snake: linked_transaction_id
      description: Unique identifier for a LinkedTransaction
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ManualJournalID:
      required: true
      in: path
      name: ManualJournalID
      x-snake: manual_journal_id
      description: Unique identifier for a ManualJournal
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    OrganisationID:
      required: true
      in: path
      name: OrganisationID
      x-snake: organisation_id
      description: The unique Xero identifier for an organisation
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    OverpaymentID:
      required: true
      in: path
      name: OverpaymentID
      x-snake: overpayment_id
      description: Unique identifier for a Overpayment
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    PaymentID:
      required: true
      in: path
      name: PaymentID
      x-snake: payment_id
      description: Unique identifier for a Payment
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    PrepaymentID:
      required: true
      in: path
      name: PrepaymentID
      x-snake: prepayment_id
      description: Unique identifier for a PrePayment
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    PurchaseOrderID:
      required: true
      in: path
      name: PurchaseOrderID
      x-snake: purchase_order_id
      description: Unique identifier for an Purchase Order
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    QuoteID:
      required: true
      in: path
      name: QuoteID
      x-snake: quote_id
      description: Unique identifier for an Quote
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    ReceiptID:
      required: true
      in: path
      name: ReceiptID
      x-snake: receipt_id
      description: Unique identifier for a Receipt
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    RepeatingInvoiceID:
      required: true
      in: path
      name: RepeatingInvoiceID
      x-snake: repeating_invoice_id
      description: Unique identifier for a Repeating Invoice
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    TrackingCategoryID:
      required: true
      in: path
      name: TrackingCategoryID
      x-snake: tracking_category_id
      description: Unique identifier for a TrackingCategory
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    TrackingOptionID:
      required: true
      in: path
      name: TrackingOptionID
      x-snake: tracking_option_id
      description: Unique identifier for a Tracking Option
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    UserID:
      required: true
      in: path
      name: UserID
      x-snake: user_id
      description: Unique identifier for a User
      example: 00000000-0000-0000-0000-000000000000
      schema:
        type: string
        format: uuid
    TaxType:
      required: true
      in: path
      name: TaxType
      description: A valid TaxType code
      example: INPUT2
      schema:
        type: string
  responses:
    400Error:
      description: A failed request due to validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    HistoryRecordCreated:
      description: Success - return response of type HistoryRecords array of HistoryRecord objects
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/HistoryRecords'
          example:
            Id: d7525479-3392-44c0-bb37-ff4a0b5df5bd
            Status: OK
            ProviderName: Xero API Partner
            DateTimeUTC: /Date(1550899400362)/
            HistoryRecords:
              - DateUTCString: 2019-02-23T05:23:20
                DateUTC: /Date(1550899400362)/
                Details: Hello World
                ValidationErrors: []
    HistoryRetrieved:
      description: Success - return response of HistoryRecords array of 0 to N HistoryRecord
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/HistoryRecords'
          example:
            Id: cd54cc7b-b721-4207-b11d-7d13c7902f91
            Status: OK
            ProviderName: Xero API Partner
            DateTimeUTC: /Date(1551311321819)/
            HistoryRecords:
              - Changes: Attached a file
                DateUTCString: 2018-11-08T15:01:21
                DateUTC: /Date(1541689281470+0000)/
                User: System Generated
                Details: Attached the file sample2.jpg through the Xero API using Xero API Partner
              - Changes: Credit Applied
                DateUTCString: 2016-10-17T20:46:01
                DateUTC: /Date(1476737161173+0000)/
                User: System Generated
                Details: Bank transfer from Business Wells Fargo to My Savings on November 12, 2016 for 20.00.
  schemas:
    AddressForOrganisation:
      externalDocs:
        url: http://developer.xero.com/documentation/api/types
      properties:
        AddressType:
          description: define the type of address
          type: string
          enum:
            - POBOX
            - STREET
            - DELIVERY
        AddressLine1:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine2:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine3:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine4:
          description: max length = 500
          maxLength: 500
          type: string
        City:
          description: max length = 255
          maxLength: 255
          type: string
        Region:
          description: max length = 255
          maxLength: 255
          type: string
        PostalCode:
          description: max length = 50
          maxLength: 50
          type: string
        Country:
          description: max length = 50, [A-Z], [a-z] only
          maxLength: 50
          type: string
        AttentionTo:
          description: max length = 255
          maxLength: 255
          type: string
      type: object
    Address:
      externalDocs:
        url: http://developer.xero.com/documentation/api/types
      properties:
        AddressType:
          description: define the type of address
          type: string
          enum:
            - POBOX
            - STREET
        AddressLine1:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine2:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine3:
          description: max length = 500
          maxLength: 500
          type: string
        AddressLine4:
          description: max length = 500
          maxLength: 500
          type: string
        City:
          description: max length = 255
          maxLength: 255
          type: string
        Region:
          description: max length = 255
          maxLength: 255
          type: string
        PostalCode:
          description: max length = 50
          maxLength: 50
          type: string
        Country:
          description: max length = 50, [A-Z], [a-z] only
          maxLength: 50
          type: string
        AttentionTo:
          description: max length = 255
          maxLength: 255
          type: string
      type: object
    Phone:
      externalDocs:
        url: http://developer.xero.com/documentation/api/types
      properties:
        PhoneType:
          type: string
          enum:
            - DEFAULT
            - DDI
            - MOBILE
            - FAX
            - OFFICE
        PhoneNumber:
          description: max length = 50
          maxLength: 50
          type: string
        PhoneAreaCode:
          description: max length = 10
          maxLength: 10
          type: string
        PhoneCountryCode:
          description: max length = 20
          maxLength: 20
          type: string
      type: object
    Accounts:
      type: object
      x-objectArrayKey: accounts
      properties:
        Accounts:
          type: array
          items:
            $ref: '#/components/schemas/Account'
    Account:
      type: object
      externalDocs:
        url: http://developer.xero.com/documentation/api/accounts/
      properties:
        Code:
          description: Customer defined alpha numeric account code e.g 200 or SALES (max length = 10)
          type: string
          example: 4400
        Name:
          description: Name of account (max length = 150)
          maxLength: 150
          type: string
          example: Food Sales
        AccountID:
          description: The Xero identifier for an account – specified as a string following  the endpoint name   e.g. /297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        Type:
          $ref: '#/components/schemas/AccountType'
          type: string
        BankAccountNumber:
          description: For bank accounts only (Account Type BANK)
          type: string
        Status:
          description: Accounts with a status of ACTIVE can be updated to ARCHIVED. See Account Status Codes
          type: string
          enum:
            - ACTIVE
            - ARCHIVED
            - DELETED
        Description:
          description: Description of the Account. Valid for all types of accounts except bank accounts (max length = 4000)
          type: string
        BankAccountType:
          description: For bank accounts only. See Bank Account types
          type: string
          enum:
            - BANK
            - CREDITCARD
            - PAYPAL
            - NONE
            - ""
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        TaxType:
          description: The tax type from taxRates
          type: string
        EnablePaymentsToAccount:
          description: Boolean – describes whether account can have payments applied to it
          type: boolean
        ShowInExpenseClaims:
          description: Boolean – describes whether account code is available for use with expense claims
          type: boolean
        Class:
          description: See Account Class Types
          readOnly: true
          type: string
          enum:
            - ASSET
            - EQUITY
            - EXPENSE
            - LIABILITY
            - REVENUE
        SystemAccount:
          description: If this is a system account then this element is returned. See System Account types. Note that non-system accounts may have this element set as either “” or null.
          readOnly: true
          type: string
          enum:
            - DEBTORS
            - CREDITORS
            - BANKCURRENCYGAIN
            - GST
            - GSTONIMPORTS
            - HISTORICAL
            - REALISEDCURRENCYGAIN
            - RETAINEDEARNINGS
            - ROUNDING
            - TRACKINGTRANSFERS
            - UNPAIDEXPCLM
            - UNREALISEDCURRENCYGAIN
            - WAGEPAYABLES
            - CISASSETS
            - CISASSET
            - CISLABOUR
            - CISLABOUREXPENSE
            - CISLABOURINCOME
            - CISLIABILITY
            - CISMATERIALS
            - ""
        ReportingCode:
          description: Shown if set
          type: string
        ReportingCodeName:
          description: Shown if set
          readOnly: true
          type: string
        HasAttachments:
          description: boolean to indicate if an account has an attachment (read only)
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        AddToWatchlist:
          description: Boolean – describes whether the account is shown in the watchlist widget on the dashboard
          type: boolean
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
    AccountType:
      description: See Account Types
      type: string
      enum:
        - BANK
        - CURRENT
        - CURRLIAB
        - DEPRECIATN
        - DIRECTCOSTS
        - EQUITY
        - EXPENSE
        - FIXED
        - INVENTORY
        - LIABILITY
        - NONCURRENT
        - OTHERINCOME
        - OVERHEADS
        - PREPAYMENT
        - REVENUE
        - SALES
        - TERMLIAB
        - PAYG
    Attachments:
      type: object
      x-objectArrayKey: attachments
      properties:
        Attachments:
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
    Attachment:
      type: object
      externalDocs:
        url: http://developer.xero.com/documentation/api/attachments/
      properties:
        AttachmentID:
          description: Unique ID for the file
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        FileName:
          description: Name of the file
          type: string
          example: xero-dev.jpg
        Url:
          description: URL to the file on xero.com
          type: string
          example: https://api.xero.com/api.xro/2.0/Accounts/da962997-a8bd-4dff-9616-01cdc199283f/Attachments/sample5.jpg
        MimeType:
          description: Type of file
          type: string
          example: image/jpg
        ContentLength:
          description: Length of the file content
          type: integer
        IncludeOnline:
          description: Include the file with the online invoice
          type: boolean
    BankTransactions:
      type: object
      x-objectArrayKey: bank_transactions
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        BankTransactions:
          type: array
          items:
            $ref: '#/components/schemas/BankTransaction'
    BankTransaction:
      externalDocs:
        url: http://developer.xero.com/documentation/api/banktransactions/
      properties:
        Type:
          description: See Bank Transaction Types
          type: string
          enum:
            - RECEIVE
            - RECEIVE-OVERPAYMENT
            - RECEIVE-PREPAYMENT
            - SPEND
            - SPEND-OVERPAYMENT
            - SPEND-PREPAYMENT
            - RECEIVE-TRANSFER
            - SPEND-TRANSFER
        Contact:
          $ref: '#/components/schemas/Contact'
        LineItems:
          description: See LineItems
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        BankAccount:
          $ref: '#/components/schemas/Account'
        IsReconciled:
          description: Boolean to show if transaction is reconciled
          type: boolean
        Date:
          description: Date of transaction – YYYY-MM-DD
          type: string
          x-is-msdate: true
        Reference:
          description: Reference for the transaction. Only supported for SPEND and RECEIVE transactions.
          type: string
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        CurrencyRate:
          description: Exchange rate to base currency when money is spent or received. e.g.0.7500 Only used for bank transactions in non base currency. If this isn’t specified for non base currency accounts then either the user-defined rate (preference) or the XE.com day rate will be used. Setting currency is only supported on overpayments.
          type: number
          format: double
          x-is-money: true
        Url:
          description: URL link to a source document – shown as “Go to App Name”
          type: string
        Status:
          description: See Bank Transaction Status Codes
          type: string
          enum:
            - AUTHORISED
            - DELETED
            - VOIDED
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        SubTotal:
          description: Total of bank transaction excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on bank transaction
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of bank transaction tax inclusive
          type: number
          format: double
          x-is-money: true
        BankTransactionID:
          description: Xero generated unique identifier for bank transaction
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        PrepaymentID:
          description: Xero generated unique identifier for a Prepayment. This will be returned on BankTransactions with a Type of SPEND-PREPAYMENT or RECEIVE-PREPAYMENT
          readOnly: true
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        OverpaymentID:
          description: Xero generated unique identifier for an Overpayment. This will be returned on BankTransactions with a Type of SPEND-OVERPAYMENT or RECEIVE-OVERPAYMENT
          readOnly: true
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        HasAttachments:
          description: Boolean to indicate if a bank transaction has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      required:
        - Type
        - LineItems
        - BankAccount
      type: object
    LineAmountTypes:
      description: Line amounts are exclusive of tax by default if you don’t specify this element. See Line Amount Types
      type: string
      enum:
        - Exclusive
        - Inclusive
        - NoTax
    LineItem:
      externalDocs:
        url: https://developer.xero.com/documentation/api/invoices#post
      properties:
        LineItemID:
          description: LineItem unique ID
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        Description:
          description: Description needs to be at least 1 char long. A line item with just a description (i.e no unit amount or quantity) can be created by specifying just a <Description> element that contains at least 1 character
          type: string
        Quantity:
          description: LineItem Quantity
          type: number
          format: double
          x-is-money: true
        UnitAmount:
          description: LineItem Unit Amount
          type: number
          format: double
          x-is-money: true
        ItemCode:
          description: See Items
          type: string
        AccountCode:
          description: See Accounts
          type: string
        AccountID:
          description: The associated account ID related to this line item
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        TaxType:
          description: The tax type from TaxRates
          type: string
        TaxAmount:
          description: The tax amount is auto calculated as a percentage of the line amount (see below) based on the tax rate. This value can be overriden if the calculated <TaxAmount> is not correct.
          type: number
          format: double
          x-is-money: true
        Item:
          $ref: '#/components/schemas/LineItemItem'
        LineAmount:
          description: If you wish to omit either the Quantity or UnitAmount you can provide a LineAmount and Xero will calculate the missing amount for you. The line amount reflects the discounted price if either a DiscountRate or DiscountAmount has been used i.e. LineAmount = Quantity * Unit Amount * ((100 - DiscountRate)/100) or LineAmount = (Quantity * UnitAmount) - DiscountAmount
          type: number
          format: double
          x-is-money: true
        Tracking:
          description: Optional Tracking Category – see Tracking.  Any LineItem can have a  maximum of 2 <TrackingCategory> elements.
          type: array
          items:
            $ref: '#/components/schemas/LineItemTracking'
        DiscountRate:
          description: Percentage discount being applied to a line item (only supported on  ACCREC invoices – ACC PAY invoices and credit notes in Xero do not support discounts
          type: number
          format: double
          x-is-money: true
        DiscountAmount:
          description: Discount amount being applied to a line item. Only supported on ACCREC invoices and quotes. ACCPAY invoices and credit notes in Xero do not support discounts.
          type: number
          format: double
          x-is-money: true
        RepeatingInvoiceID:
          description: The Xero identifier for a Repeating Invoice
          example: 00000000-0000-0000-0000-000000000000
          type: string
          format: uuid
        Taxability:
          description: The type of taxability
          type: string
          enum:
            - TAXABLE
            - NON_TAXABLE
            - EXEMPT
            - PART_TAXABLE
            - NOT_APPLICABLE
        SalesTaxCodeId:
          description: The ID of the sales tax code
          type: number
        TaxBreakdown:
          description: An array of tax components defined for this line item
          type: array
          items:
            $ref: '#/components/schemas/TaxBreakdownComponent'
      type: object
    LineItemItem:
      properties:
        Code:
          description: User defined item code (max length = 30)
          maxLength: 30
          type: string
        Name:
          description: The name of the item (max length = 50)
          maxLength: 50
          type: string
        ItemID:
          description: The Xero identifier for an Item
          type: string
          format: uuid
    LineItemTracking:
      externalDocs:
        url: https://developer.xero.com/documentation/api/invoices#post
      properties:
        TrackingCategoryID:
          description: The Xero identifier for a tracking category
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        TrackingOptionID:
          description: The Xero identifier for a tracking category option
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        Name:
          description: The name of the tracking category
          maxLength: 100
          type: string
          example: Region
        Option:
          description: See Tracking Options
          type: string
          example: North
      type: object
    BankTransfers:
      type: object
      x-objectArrayKey: bank_transfers
      properties:
        BankTransfers:
          type: array
          items:
            $ref: '#/components/schemas/BankTransfer'
    BankTransfer:
      externalDocs:
        url: http://developer.xero.com/documentation/api/bank-transfers/
      properties:
        FromBankAccount:
          $ref: '#/components/schemas/Account'
        ToBankAccount:
          $ref: '#/components/schemas/Account'
        Amount:
          description: amount of the transaction
          type: number
          format: double
          x-is-money: true
        Date:
          description: The date of the Transfer YYYY-MM-DD
          type: string
          x-is-msdate: true
        BankTransferID:
          description: The identifier of the Bank Transfer
          readOnly: true
          type: string
          format: uuid
        CurrencyRate:
          description: The currency rate
          readOnly: true
          type: number
          format: double
          x-is-money: true
        FromBankTransactionID:
          description: The Bank Transaction ID for the source account
          readOnly: true
          type: string
          format: uuid
        ToBankTransactionID:
          description: The Bank Transaction ID for the destination account
          readOnly: true
          type: string
          format: uuid
        FromIsReconciled:
          description: The Bank Transaction boolean to show if it is reconciled for the source account
          type: boolean
          default: "false"
          example: "false"
        ToIsReconciled:
          description: The Bank Transaction boolean to show if it is reconciled for the destination account
          type: boolean
          default: "false"
          example: "false"
        Reference:
          description: Reference for the transactions.
          type: string
        HasAttachments:
          description: Boolean to indicate if a Bank Transfer has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        CreatedDateUTC:
          description: UTC timestamp of creation date of bank transfer
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      required:
        - FromBankAccount
        - ToBankAccount
        - Amount
      type: object
    BatchPayments:
      type: object
      x-objectArrayKey: batch_payments
      properties:
        BatchPayments:
          type: array
          items:
            $ref: '#/components/schemas/BatchPayment'
    BatchPayment:
      externalDocs:
        url: http://developer.xero.com/documentation/api/BatchPayments/
      properties:
        Account:
          $ref: '#/components/schemas/Account'
        Reference:
          description: (NZ Only) Optional references for the batch payment transaction. It will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement you import into Xero.
          type: string
          maxLength: 255
        Particulars:
          description: (NZ Only) Optional references for the batch payment transaction. It will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement you import into Xero.
          type: string
          maxLength: 12
        Code:
          description: (NZ Only) Optional references for the batch payment transaction. It will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement you import into Xero.
          type: string
          maxLength: 12
        Details:
          description: (Non-NZ Only) These details are sent to the org’s bank as a reference for the batch payment transaction. They will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement imported into Xero. Maximum field length = 18
          type: string
        Narrative:
          description: (UK Only) Only shows on the statement line in Xero. Max length =18
          type: string
          maxLength: 18
        BatchPaymentID:
          description: The Xero generated unique identifier for the bank transaction (read-only)
          readOnly: true
          type: string
          format: uuid
        DateString:
          description: Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06
          type: string
        Date:
          description: Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06
          type: string
          x-is-msdate: true
        Amount:
          description: The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00
          type: number
          format: double
          x-is-money: true
        Payments:
          description: An array of payments
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        Type:
          description: PAYBATCH for bill payments or RECBATCH for sales invoice payments (read-only)
          readOnly: true
          type: string
          enum:
            - PAYBATCH
            - RECBATCH
        Status:
          description: AUTHORISED or DELETED (read-only). New batch payments will have a status of AUTHORISED. It is not possible to delete batch payments via the API.
          readOnly: true
          type: string
          enum:
            - AUTHORISED
            - DELETED
        TotalAmount:
          description: The total of the payments that make up the batch (read-only)
          type: number
          format: double
          x-is-money: true
          readOnly: true
        UpdatedDateUTC:
          description: UTC timestamp of last update to the payment
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        IsReconciled:
          description: Booelan that tells you if the batch payment has been reconciled (read-only)
          readOnly: true
          type: boolean
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      type: object
    BatchPaymentDetails:
      description: Bank details for use on a batch payment stored with each contact
      externalDocs:
        url: http://developer.xero.com/documentation/api/Contact/
      properties:
        BankAccountNumber:
          description: Bank account number for use with Batch Payments
          type: string
          example: 123-456-1111111
        BankAccountName:
          description: Name of bank for use with Batch Payments
          type: string
          example: ACME Bank
        Details:
          description: (Non-NZ Only) These details are sent to the org’s bank as a reference for the batch payment transaction. They will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement imported into Xero. Maximum field length = 18
          type: string
          example: Hello World
        Code:
          description: (NZ Only) Optional references for the batch payment transaction. It will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement you import into Xero.
          type: string
          maxLength: 12
          example: ABC
        Reference:
          description: (NZ Only) Optional references for the batch payment transaction. It will also show with the batch payment transaction in the bank reconciliation Find & Match screen. Depending on your individual bank, the detail may also show on the bank statement you import into Xero.
          type: string
          maxLength: 12
          example: Foobar
    BatchPaymentDelete:
      externalDocs:
        url: http://developer.xero.com/documentation/api/accounting/batchpayments
      properties:
        BatchPaymentID:
          description: The Xero generated unique identifier for the bank transaction (read-only)
          type: string
          format: uuid
        Status:
          description: The status of the batch payment.
          type: string
          default: DELETED
      required:
        - Status
        - BatchPaymentID
      type: object
    BatchPaymentDeleteByUrlParam:
      externalDocs:
        url: http://developer.xero.com/documentation/api/accounting/batchpayments
      properties:
        Status:
          description: The status of the batch payment.
          type: string
          default: DELETED
      required:
        - Status
      type: object
    BrandingThemes:
      type: object
      x-objectArrayKey: branding_themes
      properties:
        BrandingThemes:
          type: array
          items:
            $ref: '#/components/schemas/BrandingTheme'
    BrandingTheme:
      externalDocs:
        url: http://developer.xero.com/documentation/api/branding-themes/
      properties:
        BrandingThemeID:
          description: Xero identifier
          type: string
          format: uuid
        Name:
          description: Name of branding theme
          type: string
        LogoUrl:
          description: The location of the image file used as the logo on this branding theme
          type: string
        Type:
          description: Always INVOICE
          type: string
          enum:
            - INVOICE
        SortOrder:
          description: Integer – ranked order of branding theme. The default branding theme has a value of 0
          type: integer
        CreatedDateUTC:
          description: UTC timestamp of creation date of branding theme
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
      type: object
    PaymentServices:
      type: object
      x-objectArrayKey: payment_services
      properties:
        PaymentServices:
          type: array
          items:
            $ref: '#/components/schemas/PaymentService'
    PaymentService:
      externalDocs:
        url: http://developer.xero.com/documentation/api/branding-themes/
      properties:
        PaymentServiceID:
          description: Xero identifier
          type: string
          format: uuid
        PaymentServiceName:
          description: Name of payment service
          type: string
        PaymentServiceUrl:
          description: The custom payment URL
          type: string
        PayNowText:
          description: The text displayed on the Pay Now button in Xero Online Invoicing. If this is not set it will default to Pay by credit card
          type: string
        PaymentServiceType:
          description: This will always be CUSTOM for payment services created via the API.
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
    Contacts:
      type: object
      x-objectArrayKey: contacts
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Contacts:
          type: array
          items:
            $ref: '#/components/schemas/Contact'
    Contact:
      externalDocs:
        url: http://developer.xero.com/documentation/api/contacts/
      properties:
        ContactID:
          description: Xero identifier
          type: string
          format: uuid
        MergedToContactID:
          description: ID for the destination of a merged contact. Only returned when using paging or when fetching a contact by ContactId or ContactNumber.
          type: string
          format: uuid
        ContactNumber:
          description: This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero.
          maxLength: 50
          type: string
        AccountNumber:
          description: A user defined account number. This can be updated via the API and the Xero UI (max length = 50)
          maxLength: 50
          type: string
        ContactStatus:
          description: Current status of a contact – see contact status types
          type: string
          enum:
            - ACTIVE
            - ARCHIVED
            - GDPRREQUEST
        Name:
          description: Full name of contact/organisation (max length = 255)
          maxLength: 255
          type: string
        FirstName:
          description: First name of contact person (max length = 255)
          maxLength: 255
          type: string
        LastName:
          description: Last name of contact person (max length = 255)
          maxLength: 255
          type: string
        CompanyNumber:
          description: Company registration number (max length = 50)
          maxLength: 50
          type: string
        EmailAddress:
          description: Email address of contact person (umlauts not supported) (max length  = 255)
          maxLength: 255
          type: string
        ContactPersons:
          description: See contact persons
          type: array
          items:
            $ref: '#/components/schemas/ContactPerson'
        BankAccountDetails:
          description: Bank account number of contact
          type: string
        TaxNumber:
          description: Tax number of contact – this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)
          maxLength: 50
          type: string
        AccountsReceivableTaxType:
          description: The tax type from TaxRates
          type: string
        AccountsPayableTaxType:
          description: The tax type from TaxRates
          type: string
        Addresses:
          description: Store certain address types for a contact – see address types
          type: array
          items:
            $ref: '#/components/schemas/Address'
        Phones:
          description: Store certain phone types for a contact – see phone types
          type: array
          items:
            $ref: '#/components/schemas/Phone'
        IsSupplier:
          description: true or false – Boolean that describes if a contact that has any AP  invoices entered against them. Cannot be set via PUT or POST – it is automatically set when an accounts payable invoice is generated against this contact.
          type: boolean
        IsCustomer:
          description: true or false – Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST – it is automatically set when an accounts receivable invoice is generated against this contact.
          type: boolean
        SalesDefaultLineAmountType:
          description: The default sales line amount type for a contact. Only available when summaryOnly parameter or paging is used, or when fetch by ContactId or ContactNumber.
          type: string
          enum:
            - INCLUSIVE
            - EXCLUSIVE
            - NONE
        PurchasesDefaultLineAmountType:
          description: The default purchases line amount type for a contact Only available when summaryOnly parameter or paging is used, or when fetch by ContactId or ContactNumber.
          type: string
          enum:
            - INCLUSIVE
            - EXCLUSIVE
            - NONE
        DefaultCurrency:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        XeroNetworkKey:
          description: Store XeroNetworkKey for contacts.
          type: string
        SalesDefaultAccountCode:
          description: The default sales account code for contacts
          type: string
        PurchasesDefaultAccountCode:
          description: The default purchases account code for contacts
          type: string
        SalesTrackingCategories:
          description: The default sales tracking categories for contacts
          type: array
          items:
            $ref: '#/components/schemas/SalesTrackingCategory'
        PurchasesTrackingCategories:
          description: The default purchases tracking categories for contacts
          type: array
          items:
            $ref: '#/components/schemas/SalesTrackingCategory'
        TrackingCategoryName:
          description: The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories
          type: string
        TrackingCategoryOption:
          description: The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories
          type: string
        PaymentTerms:
          $ref: '#/components/schemas/PaymentTerm'
        UpdatedDateUTC:
          description: UTC timestamp of last update to contact
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        ContactGroups:
          description: Displays which contact groups a contact is included in
          type: array
          items:
            $ref: '#/components/schemas/ContactGroup'
        Website:
          description: Website address for contact (read only)
          readOnly: true
          type: string
        BrandingTheme:
          $ref: '#/components/schemas/BrandingTheme'
        BatchPayments:
          $ref: '#/components/schemas/BatchPaymentDetails'
        Discount:
          description: The default discount rate for the contact (read only)
          readOnly: true
          type: number
          format: double
          x-is-money: true
        Balances:
          $ref: '#/components/schemas/Balances'
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
        HasAttachments:
          description: A boolean to indicate if a contact has an attachment
          type: boolean
          default: "false"
          example: "false"
        ValidationErrors:
          description: Displays validation errors returned from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        HasValidationErrors:
          description: A boolean to indicate if a contact has an validation errors
          type: boolean
          default: "false"
          example: "false"
        StatusAttributeString:
          description: Status of object
          type: string
      type: object
    Budgets:
      type: object
      x-objectArrayKey: budgets
      properties:
        Budgets:
          type: array
          items:
            $ref: '#/components/schemas/Budget'
    Budget:
      type: object
      externalDocs:
        url: http://developer.xero.com/documentation/api/budgets/
      properties:
        BudgetID:
          description: Xero identifier
          type: string
          format: uuid
        Type:
          description: Type of Budget. OVERALL or TRACKING
          type: string
          enum:
            - OVERALL
            - TRACKING
        Description:
          description: The Budget description
          maxLength: 255
          type: string
        UpdatedDateUTC:
          description: UTC timestamp of last update to budget
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        BudgetLines:
          type: array
          items:
            $ref: '#/components/schemas/BudgetLine'
        Tracking:
          type: array
          items:
            $ref: '#/components/schemas/TrackingCategory'
    BudgetLine:
      type: object
      externalDocs:
        url: http://developer.xero.com/documentation/api/budgets/
      properties:
        AccountID:
          description: See Accounts
          type: string
          format: uuid
        AccountCode:
          description: See Accounts
          type: string
          example: 090
        BudgetBalances:
          type: array
          items:
            $ref: '#/components/schemas/BudgetBalance'
    BudgetBalance:
      type: object
      properties:
        Period:
          description: Period the amount applies to (e.g. “2019-08”)
          type: string
          x-is-msdate: true
        Amount:
          description: LineItem Quantity
          type: number
          format: double
          x-is-money: true
        UnitAmount:
          description: Budgeted amount
          type: number
          format: double
          x-is-money: true
        Notes:
          description: Any footnotes associated with this balance
          maxLength: 255
          type: string
    Balances:
      type: object
      description: The raw AccountsReceivable(sales invoices) and AccountsPayable(bills) outstanding and overdue amounts, not converted to base currency (read only)
      properties:
        AccountsReceivable:
          $ref: '#/components/schemas/AccountsReceivable'
        AccountsPayable:
          $ref: '#/components/schemas/AccountsPayable'
    AccountsReceivable:
      type: object
      properties:
        Outstanding:
          type: number
          format: double
          x-is-money: true
        Overdue:
          type: number
          format: double
          x-is-money: true
    AccountsPayable:
      type: object
      properties:
        Outstanding:
          type: number
          format: double
          x-is-money: true
        Overdue:
          type: number
          format: double
          x-is-money: true
    CISSettings:
      type: object
      x-objectArrayKey: cis_settings
      properties:
        CISSettings:
          type: array
          items:
            $ref: '#/components/schemas/CISSetting'
    CISSetting:
      externalDocs:
        url: http://developer.xero.com/documentation/api/contacts/
      properties:
        CISEnabled:
          description: Boolean that describes if the contact is a CIS Subcontractor
          type: boolean
        Rate:
          description: CIS Deduction rate for the contact if he is a subcontractor. If the contact is not CISEnabled, then the rate is not returned
          type: number
          format: double
          readOnly: true
          x-is-money: true
    CISOrgSettings:
      type: object
      x-objectArrayKey: cis_settings
      properties:
        CISSettings:
          type: array
          items:
            $ref: '#/components/schemas/CISOrgSetting'
    CISOrgSetting:
      externalDocs:
        url: https://developer.xero.com/documentation/api/organisation
      properties:
        CISContractorEnabled:
          description: true or false - Boolean that describes if the organisation is a CIS Contractor
          type: boolean
        CISSubContractorEnabled:
          description: true or false - Boolean that describes if the organisation is a CIS SubContractor
          type: boolean
        Rate:
          description: CIS Deduction rate for the organisation
          type: number
          format: double
          readOnly: true
          x-is-money: true
    ContactPerson:
      externalDocs:
        url: http://developer.xero.com/documentation/api/contacts/
      properties:
        FirstName:
          description: First name of person
          type: string
        LastName:
          description: Last name of person
          type: string
        EmailAddress:
          description: Email address of person
          type: string
        IncludeInEmails:
          description: boolean to indicate whether contact should be included on emails with invoices etc.
          type: boolean
      type: object
    ContactGroups:
      type: object
      x-objectArrayKey: contact_groups
      properties:
        ContactGroups:
          type: array
          items:
            $ref: '#/components/schemas/ContactGroup'
    ContactGroup:
      externalDocs:
        url: http://developer.xero.com/documentation/api/contactgroups/
      properties:
        Name:
          description: The Name of the contact group. Required when creating a new contact  group
          type: string
        Status:
          description: The Status of a contact group. To delete a contact group update the status to DELETED. Only contact groups with a status of ACTIVE are returned on GETs.
          type: string
          enum:
            - ACTIVE
            - DELETED
        ContactGroupID:
          description: The Xero identifier for an contact group – specified as a string following the endpoint name. e.g. /297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
        Contacts:
          description: The ContactID and Name of Contacts in a contact group. Returned on GETs when the ContactGroupID is supplied in the URL.
          type: array
          items:
            $ref: '#/components/schemas/Contact'
      type: object
    RequestEmpty:
      externalDocs:
        url: http://developer.xero.com/documentation/api/invoice/
      properties:
        Status:
          description: Need at least one field to create an empty JSON payload
          type: string
      type: object
    CreditNotes:
      type: object
      x-objectArrayKey: credit_notes
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        CreditNotes:
          type: array
          items:
            $ref: '#/components/schemas/CreditNote'
    CreditNote:
      externalDocs:
        url: http://developer.xero.com/documentation/api/credit-notes/
      properties:
        Type:
          description: See Credit Note Types
          type: string
          enum:
            - ACCPAYCREDIT
            - ACCRECCREDIT
        Contact:
          $ref: '#/components/schemas/Contact'
        Date:
          description: The date the credit note is issued YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation
          type: string
          x-is-msdate: true
        DueDate:
          description: Date invoice is due – YYYY-MM-DD
          type: string
          x-is-msdate: true
        Status:
          description: See Credit Note Status Codes
          type: string
          enum:
            - DRAFT
            - SUBMITTED
            - DELETED
            - AUTHORISED
            - PAID
            - VOIDED
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        LineItems:
          description: See Invoice Line Items
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        SubTotal:
          description: The subtotal of the credit note excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: The total tax on the credit note
          type: number
          format: double
          x-is-money: true
        Total:
          description: The total of the Credit Note(subtotal + total tax)
          type: number
          format: double
          x-is-money: true
        CISDeduction:
          description: CIS deduction for UK contractors
          readOnly: true
          type: number
          format: double
          x-is-money: true
        CISRate:
          description: CIS Deduction rate for the organisation
          type: number
          format: double
          readOnly: true
          x-is-money: true
        UpdatedDateUTC:
          description: UTC timestamp of last update to the credit note
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        CurrencyCode:
          description: The specified currency code
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        FullyPaidOnDate:
          description: Date when credit note was fully paid(UTC format)
          type: string
          x-is-msdate: true
        CreditNoteID:
          description: Xero generated unique identifier
          type: string
          format: uuid
        CreditNoteNumber:
          description: ACCRECCREDIT – Unique alpha numeric code identifying credit note (when missing will auto-generate from your Organisation Invoice Settings)
          type: string
        Reference:
          description: ACCRECCREDIT only – additional reference number
          type: string
        SentToContact:
          description: Boolean to set whether the credit note in the Xero app should be marked as “sent”. This can be set only on credit notes that have been approved
          readOnly: true
          type: boolean
        CurrencyRate:
          description: The currency rate for a multicurrency invoice. If no rate is specified, the XE.com day rate is used
          type: number
          format: double
          x-is-money: true
        RemainingCredit:
          description: The remaining credit balance on the Credit Note
          type: number
          format: double
          x-is-money: true
        Allocations:
          description: See Allocations
          type: array
          items:
            $ref: '#/components/schemas/Allocation'
        AppliedAmount:
          description: The amount of applied to an invoice
          type: number
          format: double
          example: 2.00
          x-is-money: true
        Payments:
          description: See Payments
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        BrandingThemeID:
          description: See BrandingThemes
          type: string
          format: uuid
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        HasAttachments:
          description: boolean to indicate if a credit note has an attachment
          type: boolean
          default: "false"
          example: "false"
        HasErrors:
          description: A boolean to indicate if a credit note has an validation errors
          type: boolean
          default: "false"
          example: "false"
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        InvoiceAddresses:
          description: An array of addresses used to auto calculate sales tax
          type: array
          items:
            $ref: '#/components/schemas/InvoiceAddress'
      type: object
    Allocations:
      type: object
      x-objectArrayKey: allocations
      properties:
        Allocations:
          type: array
          items:
            $ref: '#/components/schemas/Allocation'
    Allocation:
      externalDocs:
        url: http://developer.xero.com/documentation/api/prepayments/
      properties:
        AllocationID:
          description: Xero generated unique identifier
          type: string
          format: uuid
        Invoice:
          $ref: '#/components/schemas/Invoice'
        Overpayment:
          $ref: '#/components/schemas/Overpayment'
        Prepayment:
          $ref: '#/components/schemas/Prepayment'
        CreditNote:
          $ref: '#/components/schemas/CreditNote'
        Amount:
          description: the amount being applied to the invoice
          type: number
          format: double
          x-is-money: true
        Date:
          description: the date the allocation is applied YYYY-MM-DD.
          type: string
          x-is-msdate: true
        IsDeleted:
          description: A flag that returns true when the allocation is succesfully deleted
          type: boolean
          readOnly: true
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      required:
        - Amount
        - Invoice
        - Date
      type: object
    Currencies:
      type: object
      x-objectArrayKey: currencies
      properties:
        Currencies:
          type: array
          items:
            $ref: '#/components/schemas/Currency'
    Currency:
      externalDocs:
        url: http://developer.xero.com/documentation/api/currencies/
      properties:
        Code:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        Description:
          description: Name of Currency
          type: string
      type: object
    CurrencyCode:
      description: 3 letter alpha code for the currency – see list of currency codes
      type: string
      x-enum-varnames:
        - AED
        - AFN
        - ALL
        - AMD
        - ANG
        - AOA
        - ARS
        - AUD
        - AWG
        - AZN
        - BAM
        - BBD
        - BDT
        - BGN
        - BHD
        - BIF
        - BMD
        - BND
        - BOB
        - BRL
        - BSD
        - BTN
        - BWP
        - BYN
        - BYR
        - BZD
        - CAD
        - CDF
        - CHF
        - CLF
        - CLP
        - CNY
        - COP
        - CRC
        - CUC
        - CUP
        - CVE
        - CZK
        - DJF
        - DKK
        - DOP
        - DZD
        - EEK
        - EGP
        - ERN
        - ETB
        - EUR
        - FJD
        - FKP
        - GBP
        - GEL
        - GHS
        - GIP
        - GMD
        - GNF
        - GTQ
        - GYD
        - HKD
        - HNL
        - HRK
        - HTG
        - HUF
        - IDR
        - ILS
        - INR
        - IQD
        - IRR
        - ISK
        - JMD
        - JOD
        - JPY
        - KES
        - KGS
        - KHR
        - KMF
        - KPW
        - KRW
        - KWD
        - KYD
        - KZT
        - LAK
        - LBP
        - LKR
        - LRD
        - LSL
        - LTL
        - LVL
        - LYD
        - MAD
        - MDL
        - MGA
        - MKD
        - MMK
        - MNT
        - MOP
        - MRO
        - MRU
        - MUR
        - MVR
        - MWK
        - MXN
        - MXV
        - MYR
        - MZN
        - NAD
        - NGN
        - NIO
        - NOK
        - NPR
        - NZD
        - OMR
        - PAB
        - PEN
        - PGK
        - PHP
        - PKR
        - PLN
        - PYG
        - QAR
        - RON
        - RSD
        - RUB
        - RWF
        - SAR
        - SBD
        - SCR
        - SDG
        - SEK
        - SGD
        - SHP
        - SKK
        - SLE
        - SLL
        - SOS
        - SRD
        - STN
        - STD
        - SVC
        - SYP
        - SZL
        - THB
        - TJS
        - TMT
        - TND
        - TOP
        - TRY_LIRA
        - TTD
        - TWD
        - TZS
        - UAH
        - UGX
        - USD
        - UYU
        - UZS
        - VEF
        - VES
        - VND
        - VUV
        - WST
        - XAF
        - XCD
        - XOF
        - XPF
        - YER
        - ZAR
        - ZMW
        - ZMK
        - ZWD
        - EMPTY_CURRENCY
      enum:
        - AED
        - AFN
        - ALL
        - AMD
        - ANG
        - AOA
        - ARS
        - AUD
        - AWG
        - AZN
        - BAM
        - BBD
        - BDT
        - BGN
        - BHD
        - BIF
        - BMD
        - BND
        - BOB
        - BRL
        - BSD
        - BTN
        - BWP
        - BYN
        - BYR
        - BZD
        - CAD
        - CDF
        - CHF
        - CLF
        - CLP
        - CNY
        - COP
        - CRC
        - CUC
        - CUP
        - CVE
        - CZK
        - DJF
        - DKK
        - DOP
        - DZD
        - EEK
        - EGP
        - ERN
        - ETB
        - EUR
        - FJD
        - FKP
        - GBP
        - GEL
        - GHS
        - GIP
        - GMD
        - GNF
        - GTQ
        - GYD
        - HKD
        - HNL
        - HRK
        - HTG
        - HUF
        - IDR
        - ILS
        - INR
        - IQD
        - IRR
        - ISK
        - JMD
        - JOD
        - JPY
        - KES
        - KGS
        - KHR
        - KMF
        - KPW
        - KRW
        - KWD
        - KYD
        - KZT
        - LAK
        - LBP
        - LKR
        - LRD
        - LSL
        - LTL
        - LVL
        - LYD
        - MAD
        - MDL
        - MGA
        - MKD
        - MMK
        - MNT
        - MOP
        - MRO
        - MRU
        - MUR
        - MVR
        - MWK
        - MXN
        - MXV
        - MYR
        - MZN
        - NAD
        - NGN
        - NIO
        - NOK
        - NPR
        - NZD
        - OMR
        - PAB
        - PEN
        - PGK
        - PHP
        - PKR
        - PLN
        - PYG
        - QAR
        - RON
        - RSD
        - RUB
        - RWF
        - SAR
        - SBD
        - SCR
        - SDG
        - SEK
        - SGD
        - SHP
        - SKK
        - SLE
        - SLL
        - SOS
        - SRD
        - STD
        - STN
        - SVC
        - SYP
        - SZL
        - THB
        - TJS
        - TMT
        - TND
        - TOP
        - TRY
        - TTD
        - TWD
        - TZS
        - UAH
        - UGX
        - USD
        - UYU
        - UZS
        - VEF
        - VES
        - VND
        - VUV
        - WST
        - XAF
        - XCD
        - XOF
        - XPF
        - YER
        - ZAR
        - ZMW
        - ZMK
        - ZWD
    Employees:
      type: object
      x-objectArrayKey: employees
      properties:
        Employees:
          type: array
          items:
            $ref: '#/components/schemas/Employee'
    Employee:
      externalDocs:
        url: http://developer.xero.com/documentation/api/employees/
      properties:
        EmployeeID:
          description: The Xero identifier for an employee e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
        Status:
          description: Current status of an employee – see contact status types
          type: string
          enum:
            - ACTIVE
            - ARCHIVED
            - GDPRREQUEST
            - DELETED
        FirstName:
          description: First name of an employee (max length = 255)
          maxLength: 255
          type: string
        LastName:
          description: Last name of an employee (max length = 255)
          maxLength: 255
          type: string
        ExternalLink:
          $ref: '#/components/schemas/ExternalLink'
        UpdatedDateUTC:
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
          example: ERROR
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      type: object
    ExpenseClaims:
      type: object
      x-objectArrayKey: expense_claims
      properties:
        ExpenseClaims:
          type: array
          items:
            $ref: '#/components/schemas/ExpenseClaim'
    ExpenseClaim:
      externalDocs:
        url: http://developer.xero.com/documentation/api/expense-claims/
      properties:
        ExpenseClaimID:
          description: Xero generated unique identifier for an expense claim
          type: string
          format: uuid
        Status:
          description: Current status of an expense claim – see status types
          type: string
          enum:
            - SUBMITTED
            - AUTHORISED
            - PAID
            - VOIDED
            - DELETED
        Payments:
          description: See Payments
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        User:
          $ref: '#/components/schemas/User'
        Receipts:
          type: array
          items:
            $ref: '#/components/schemas/Receipt'
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        Total:
          description: The total of an expense claim being paid
          readOnly: true
          type: number
          format: double
          x-is-money: true
        AmountDue:
          description: The amount due to be paid for an expense claim
          readOnly: true
          type: number
          format: double
          x-is-money: true
        AmountPaid:
          description: The amount still to pay for an expense claim
          readOnly: true
          type: number
          format: double
          x-is-money: true
        PaymentDueDate:
          description: The date when the expense claim is due to be paid YYYY-MM-DD
          readOnly: true
          type: string
          x-is-msdate: true
        ReportingDate:
          description: The date the expense claim will be reported in Xero YYYY-MM-DD
          readOnly: true
          type: string
          x-is-msdate: true
        ReceiptID:
          description: The Xero identifier for the Receipt e.g. e59a2c7f-1306-4078-a0f3-73537afcbba9
          type: string
          format: uuid
      type: object
    HistoryRecords:
      type: object
      x-objectArrayKey: history_records
      properties:
        HistoryRecords:
          type: array
          items:
            $ref: '#/components/schemas/HistoryRecord'
    HistoryRecord:
      externalDocs:
        url: https://developer.xero.com/documentation/api/history-and-notes
      properties:
        Details:
          description: details
          type: string
        Changes:
          description: Name of branding theme
          type: string
        User:
          description: has a value of 0
          type: string
        DateUTC:
          description: UTC timestamp of creation date of branding theme
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
      type: object
    Invoices:
      type: object
      x-objectArrayKey: invoices
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Invoices:
          type: array
          items:
            $ref: '#/components/schemas/Invoice'
    Invoice:
      externalDocs:
        url: http://developer.xero.com/documentation/api/invoices/
      properties:
        Type:
          description: See Invoice Types
          type: string
          enum:
            - ACCPAY
            - ACCPAYCREDIT
            - APOVERPAYMENT
            - APPREPAYMENT
            - ACCREC
            - ACCRECCREDIT
            - AROVERPAYMENT
            - ARPREPAYMENT
        Contact:
          $ref: '#/components/schemas/Contact'
        LineItems:
          description: See LineItems
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        Date:
          description: Date invoice was issued – YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation
          type: string
          x-is-msdate: true
        DueDate:
          description: Date invoice is due – YYYY-MM-DD
          type: string
          x-is-msdate: true
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        InvoiceNumber:
          description: ACCREC – Unique alpha numeric code identifying invoice (when missing will auto-generate from your Organisation Invoice Settings) (max length = 255)
          maxLength: 255
          type: string
        Reference:
          description: ACCREC only – additional reference number
          type: string
        BrandingThemeID:
          description: See BrandingThemes
          type: string
          format: uuid
        Url:
          description: URL link to a source document – shown as “Go to [appName]” in the Xero app
          type: string
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        CurrencyRate:
          description: The currency rate for a multicurrency invoice. If no rate is specified, the XE.com day rate is used. (max length = [18].[6])
          type: number
          format: double
          x-is-money: true
        Status:
          description: See Invoice Status Codes
          type: string
          enum:
            - DRAFT
            - SUBMITTED
            - DELETED
            - AUTHORISED
            - PAID
            - VOIDED
        SentToContact:
          description: Boolean to set whether the invoice in the Xero app should be marked as “sent”. This can be set only on invoices that have been approved
          type: boolean
        ExpectedPaymentDate:
          description: Shown on sales invoices (Accounts Receivable) when this has been set
          type: string
          x-is-msdate: true
        PlannedPaymentDate:
          description: Shown on bills (Accounts Payable) when this has been set
          type: string
          x-is-msdate: true
        CISDeduction:
          description: CIS deduction for UK contractors
          readOnly: true
          type: number
          format: double
          x-is-money: true
        CISRate:
          description: CIS Deduction rate for the organisation
          type: number
          format: double
          readOnly: true
          x-is-money: true
        SubTotal:
          description: Total of invoice excluding taxes
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on invoice
          readOnly: true
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of Invoice tax inclusive (i.e. SubTotal + TotalTax). This will be ignored if it doesn’t equal the sum of the LineAmounts
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalDiscount:
          description: Total of discounts applied on the invoice line items
          readOnly: true
          type: number
          format: double
          x-is-money: true
        InvoiceID:
          description: Xero generated unique identifier for invoice
          type: string
          format: uuid
        RepeatingInvoiceID:
          description: Xero generated unique identifier for repeating invoices
          type: string
          format: uuid
        HasAttachments:
          description: boolean to indicate if an invoice has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        IsDiscounted:
          description: boolean to indicate if an invoice has a discount
          readOnly: true
          type: boolean
        Payments:
          description: See Payments
          readOnly: true
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        Prepayments:
          description: See Prepayments
          readOnly: true
          type: array
          items:
            $ref: '#/components/schemas/Prepayment'
        Overpayments:
          description: See Overpayments
          readOnly: true
          type: array
          items:
            $ref: '#/components/schemas/Overpayment'
        AmountDue:
          description: Amount remaining to be paid on invoice
          readOnly: true
          type: number
          format: double
          x-is-money: true
        AmountPaid:
          description: Sum of payments received for invoice
          readOnly: true
          type: number
          format: double
          x-is-money: true
        FullyPaidOnDate:
          description: The date the invoice was fully paid. Only returned on fully paid invoices
          readOnly: true
          type: string
          x-is-msdate: true
        AmountCredited:
          description: Sum of all credit notes, over-payments and pre-payments applied to invoice
          readOnly: true
          type: number
          format: double
          x-is-money: true
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        CreditNotes:
          description: Details of credit notes that have been applied to an invoice
          readOnly: true
          type: array
          items:
            $ref: '#/components/schemas/CreditNote'
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
        HasErrors:
          description: A boolean to indicate if a invoice has an validation errors
          type: boolean
          default: "false"
          example: "false"
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        InvoiceAddresses:
          description: An array of addresses used to auto calculate sales tax
          type: array
          items:
            $ref: '#/components/schemas/InvoiceAddress'
      type: object
    OnlineInvoices:
      type: object
      x-objectArrayKey: online_invoices
      properties:
        OnlineInvoices:
          type: array
          items:
            $ref: '#/components/schemas/OnlineInvoice'
    OnlineInvoice:
      externalDocs:
        url: http://developer.xero.com/documentation/api/invoices/
      properties:
        OnlineInvoiceUrl:
          description: the URL to an online invoice
          type: string
      type: object
    InvoiceReminders:
      type: object
      x-objectArrayKey: invoice_reminders
      properties:
        InvoiceReminders:
          type: array
          items:
            $ref: '#/components/schemas/InvoiceReminder'
    InvoiceReminder:
      externalDocs:
        url: http://developer.xero.com/documentation/api/invoice-reminders/
      properties:
        Enabled:
          description: setting for on or off
          type: boolean
      type: object
    Items:
      type: object
      x-objectArrayKey: items
      properties:
        Items:
          type: array
          items:
            $ref: '#/components/schemas/Item'
    Item:
      externalDocs:
        url: http://developer.xero.com/documentation/api/items/
      properties:
        Code:
          description: User defined item code (max length = 30)
          maxLength: 30
          type: string
        InventoryAssetAccountCode:
          description: The inventory asset account for the item. The account must be of type INVENTORY. The  COGSAccountCode in PurchaseDetails is also required to create a tracked item
          type: string
        Name:
          description: The name of the item (max length = 50)
          maxLength: 50
          type: string
        IsSold:
          description: Boolean value, defaults to true. When IsSold is true the item will be available on sales transactions in the Xero UI. If IsSold is updated to false then Description and SalesDetails values will be nulled.
          type: boolean
        IsPurchased:
          description: Boolean value, defaults to true. When IsPurchased is true the item is available for purchase transactions in the Xero UI. If IsPurchased is updated to false then PurchaseDescription and PurchaseDetails values will be nulled.
          type: boolean
        Description:
          description: The sales description of the item (max length = 4000)
          maxLength: 4000
          type: string
        PurchaseDescription:
          description: The purchase description of the item (max length = 4000)
          maxLength: 4000
          type: string
        PurchaseDetails:
          $ref: '#/components/schemas/Purchase'
        SalesDetails:
          $ref: '#/components/schemas/Purchase'
        IsTrackedAsInventory:
          description: True for items that are tracked as inventory. An item will be tracked as inventory if the InventoryAssetAccountCode and COGSAccountCode are set.
          type: boolean
        TotalCostPool:
          description: The value of the item on hand. Calculated using average cost accounting.
          type: number
          format: double
          x-is-money: true
        QuantityOnHand:
          description: The quantity of the item on hand
          type: number
          format: double
          x-is-money: true
        UpdatedDateUTC:
          description: Last modified date in UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        ItemID:
          description: The Xero identifier for an Item
          type: string
          format: uuid
        StatusAttributeString:
          description: Status of object
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      required:
        - Code
      type: object
    Purchase:
      externalDocs:
        url: http://developer.xero.com/documentation/api/items/
      properties:
        UnitPrice:
          description: Unit Price of the item. By default UnitPrice is rounded to two decimal places. You can use 4 decimal places by adding the unitdp=4 querystring parameter to your request.
          type: number
          format: double
          x-is-money: true
        AccountCode:
          description: Default account code to be used for purchased/sale. Not applicable to the purchase details of tracked items
          type: string
        COGSAccountCode:
          description: Cost of goods sold account. Only applicable to the purchase details of tracked items.
          type: string
        TaxType:
          description: The tax type from TaxRates
          type: string
      type: object
    Journals:
      type: object
      x-objectArrayKey: journals
      properties:
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Journals:
          type: array
          items:
            $ref: '#/components/schemas/Journal'
    Journal:
      externalDocs:
        url: http://developer.xero.com/documentation/api/journals/
      properties:
        JournalID:
          description: Xero identifier
          type: string
          format: uuid
        JournalDate:
          description: Date the journal was posted
          type: string
          x-is-msdate: true
        JournalNumber:
          description: Xero generated journal number
          type: integer
        CreatedDateUTC:
          description: Created date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        Reference:
          description: reference field for additional indetifying information
          type: string
        SourceID:
          description: The identifier for the source transaction (e.g. InvoiceID)
          type: string
          format: uuid
        SourceType:
          description: The journal source type. The type of transaction that created the journal
          type: string
          enum:
            - ACCREC
            - ACCPAY
            - ACCRECCREDIT
            - ACCPAYCREDIT
            - ACCRECPAYMENT
            - ACCPAYPAYMENT
            - ARCREDITPAYMENT
            - APCREDITPAYMENT
            - CASHREC
            - CASHPAID
            - TRANSFER
            - ARPREPAYMENT
            - APPREPAYMENT
            - AROVERPAYMENT
            - APOVERPAYMENT
            - EXPCLAIM
            - EXPPAYMENT
            - MANJOURNAL
            - PAYSLIP
            - WAGEPAYABLE
            - INTEGRATEDPAYROLLPE
            - INTEGRATEDPAYROLLPT
            - EXTERNALSPENDMONEY
            - INTEGRATEDPAYROLLPTPAYMENT
            - INTEGRATEDPAYROLLCN
        JournalLines:
          description: See JournalLines
          type: array
          items:
            $ref: '#/components/schemas/JournalLine'
      type: object
    JournalLine:
      externalDocs:
        url: https://developer.xero.com/documentation/api/journals#JournalLines
      properties:
        JournalLineID:
          description: Xero identifier for Journal
          type: string
          format: uuid
          example: 7be9db36-3598-4755-ba5c-c2dbc8c4a7a2
        AccountID:
          description: See Accounts
          type: string
          format: uuid
          example: ceef66a5-a545-413b-9312-78a53caadbc4
        AccountCode:
          description: See Accounts
          type: string
          example: 090
        AccountType:
          $ref: '#/components/schemas/AccountType'
          type: string
        AccountName:
          description: See AccountCodes
          type: string
          example: Checking Account
        Description:
          description: The description from the source transaction line item. Only returned if populated.
          type: string
          example: My business checking account
        NetAmount:
          description: Net amount of journal line. This will be a positive value for a debit and negative for a credit
          type: number
          format: double
          x-is-money: true
          example: 4130.98
        GrossAmount:
          description: Gross amount of journal line (NetAmount + TaxAmount).
          type: number
          format: double
          x-is-money: true
          example: 4130.98
        TaxAmount:
          description: Total tax on a journal line
          type: number
          format: double
          x-is-money: true
          readOnly: true
          example: 0.00
        TaxType:
          description: The tax type from taxRates
          type: string
        TaxName:
          description: see TaxRates
          type: string
          example: Tax Exempt
        TrackingCategories:
          description: Optional Tracking Category – see Tracking. Any JournalLine can have a maximum of 2 <TrackingCategory> elements.
          type: array
          items:
            $ref: '#/components/schemas/TrackingCategory'
      type: object
    LinkedTransactions:
      type: object
      x-objectArrayKey: linked_transactions
      properties:
        LinkedTransactions:
          type: array
          items:
            $ref: '#/components/schemas/LinkedTransaction'
    LinkedTransaction:
      externalDocs:
        url: http://developer.xero.com/documentation/api/linked-transactions/
      properties:
        SourceTransactionID:
          description: Filter by the SourceTransactionID. Get all the linked transactions created from a particular ACCPAY invoice
          type: string
          format: uuid
        SourceLineItemID:
          description: The line item identifier from the source transaction.
          type: string
          format: uuid
        ContactID:
          description: Filter by the combination of ContactID and Status. Get all the linked transactions that have been assigned to a particular customer and have a particular status e.g. GET /LinkedTransactions?ContactID=4bb34b03-3378-4bb2-a0ed-6345abf3224e&Status=APPROVED.
          type: string
          format: uuid
        TargetTransactionID:
          description: Filter by the TargetTransactionID. Get all the linked transactions  allocated to a particular ACCREC invoice
          type: string
          format: uuid
        TargetLineItemID:
          description: The line item identifier from the target transaction. It is possible  to link multiple billable expenses to the same TargetLineItemID.
          type: string
          format: uuid
        LinkedTransactionID:
          description: The Xero identifier for an Linked Transaction e.g./LinkedTransactions/297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
        Status:
          description: Filter by the combination of ContactID and Status. Get all the linked transactions that have been assigned to a particular customer and have a particular status e.g. GET /LinkedTransactions?ContactID=4bb34b03-3378-4bb2-a0ed-6345abf3224e&Status=APPROVED.
          type: string
          enum:
            - APPROVED
            - DRAFT
            - ONDRAFT
            - BILLED
            - VOIDED
        Type:
          description: This will always be BILLABLEEXPENSE. More types may be added in future.
          type: string
          enum:
            - BILLABLEEXPENSE
        UpdatedDateUTC:
          description: The last modified date in UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        SourceTransactionTypeCode:
          description: The Type of the source tranasction. This will be ACCPAY if the linked transaction was created from an invoice and SPEND if it was created from a bank transaction.
          type: string
          enum:
            - ACCPAY
            - SPEND
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      type: object
    ManualJournals:
      type: object
      x-objectArrayKey: manual_journals
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        ManualJournals:
          type: array
          items:
            $ref: '#/components/schemas/ManualJournal'
    ManualJournal:
      externalDocs:
        url: http://developer.xero.com/documentation/api/manual-journals/
      properties:
        Narration:
          description: Description of journal being posted
          type: string
        JournalLines:
          description: See JournalLines
          type: array
          items:
            $ref: '#/components/schemas/ManualJournalLine'
        Date:
          description: Date journal was posted – YYYY-MM-DD
          type: string
          x-is-msdate: true
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        Status:
          description: See Manual Journal Status Codes
          type: string
          enum:
            - DRAFT
            - POSTED
            - DELETED
            - VOIDED
            - ARCHIVED
        Url:
          description: Url link to a source document – shown as “Go to [appName]” in the Xero app
          type: string
        ShowOnCashBasisReports:
          description: Boolean – default is true if not specified
          type: boolean
        HasAttachments:
          description: Boolean to indicate if a manual journal has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        ManualJournalID:
          description: The Xero identifier for a Manual Journal
          type: string
          format: uuid
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
          example: ERROR
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
      required:
        - Narration
      type: object
    ManualJournalLine:
      externalDocs:
        url: http://developer.xero.com/documentation/api/manual-journals/
      properties:
        LineAmount:
          description: total for line. Debits are positive, credits are negative value
          type: number
          format: double
          x-is-money: true
          example: -2569.00
        AccountCode:
          description: See Accounts
          type: string
          example: 720
        AccountID:
          description: See Accounts
          type: string
          format: uuid
        Description:
          description: Description for journal line
          type: string
          example: Coded incorrectly Office Equipment should be Computer Equipment
        TaxType:
          description: The tax type from TaxRates
          type: string
        Tracking:
          description: Optional Tracking Category – see Tracking. Any JournalLine can have a maximum of 2 <TrackingCategory> elements.
          type: array
          items:
            $ref: '#/components/schemas/TrackingCategory'
        TaxAmount:
          description: The calculated tax amount based on the TaxType and LineAmount
          type: number
          format: double
          x-is-money: true
          example: 0.00
        IsBlank:
          description: is the line blank
          type: boolean
          example: false
      type: object
    Actions:
      type: object
      x-objectArrayKey: actions
      properties:
        Actions:
          type: array
          items:
            $ref: '#/components/schemas/Action'
    Action:
      externalDocs:
        url: http://developer.xero.com/documentation/api/organisation/
      properties:
        Name:
          description: Name of the actions for this organisation
          type: string
          example: UseMulticurrency
        Status:
          description: Status of the action for this organisation
          type: string
          enum:
            - ALLOWED
            - NOT-ALLOWED
    Organisations:
      type: object
      x-objectArrayKey: organisations
      properties:
        Organisations:
          type: array
          items:
            $ref: '#/components/schemas/Organisation'
    Organisation:
      externalDocs:
        url: http://developer.xero.com/documentation/api/organisation/
      properties:
        OrganisationID:
          description: Unique Xero identifier
          type: string
          format: uuid
          example: 8be9db36-3598-4755-ba5c-c2dbc8c4a7a2
        APIKey:
          description: Display a unique key used for Xero-to-Xero transactions
          type: string
        Name:
          description: Display name of organisation shown in Xero
          type: string
        LegalName:
          description: Organisation name shown on Reports
          type: string
        PaysTax:
          description: Boolean to describe if organisation is registered with a local tax authority i.e. true, false
          type: boolean
        Version:
          description: See Version Types
          type: string
          enum:
            - AU
            - NZ
            - GLOBAL
            - UK
            - US
            - AUONRAMP
            - NZONRAMP
            - GLOBALONRAMP
            - UKONRAMP
            - USONRAMP
        OrganisationType:
          description: Organisation Type
          type: string
          enum:
            - ACCOUNTING_PRACTICE
            - COMPANY
            - CHARITY
            - CLUB_OR_SOCIETY
            - INDIVIDUAL
            - LOOK_THROUGH_COMPANY
            - NOT_FOR_PROFIT
            - PARTNERSHIP
            - S_CORPORATION
            - SELF_MANAGED_SUPERANNUATION_FUND
            - SOLE_TRADER
            - SUPERANNUATION_FUND
            - TRUST
        BaseCurrency:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        CountryCode:
          $ref: '#/components/schemas/CountryCode'
          type: string
        IsDemoCompany:
          description: Boolean to describe if organisation is a demo company.
          type: boolean
        OrganisationStatus:
          description: Will be set to ACTIVE if you can connect to organisation via the Xero API
          type: string
        RegistrationNumber:
          description: Shows for New Zealand, Australian and UK organisations
          type: string
        EmployerIdentificationNumber:
          description: Shown if set. US Only.
          type: string
        TaxNumber:
          description: Shown if set. Displays in the Xero UI as Tax File Number (AU), GST Number (NZ), VAT Number (UK) and Tax ID Number (US & Global).
          type: string
        FinancialYearEndDay:
          description: Calendar day e.g. 0-31
          type: integer
        FinancialYearEndMonth:
          description: Calendar Month e.g. 1-12
          type: integer
        SalesTaxBasis:
          description: The accounting basis used for tax returns. See Sales Tax Basis
          type: string
          enum:
            - PAYMENTS
            - INVOICE
            - NONE
            - CASH
            - ACCRUAL
            - FLATRATECASH
            - FLATRATEACCRUAL
            - ACCRUALS
        SalesTaxPeriod:
          description: The frequency with which tax returns are processed. See Sales Tax Period
          type: string
          enum:
            - MONTHLY
            - QUARTERLY1
            - QUARTERLY2
            - QUARTERLY3
            - ANNUALLY
            - ONEMONTHS
            - TWOMONTHS
            - SIXMONTHS
            - 1MONTHLY
            - 2MONTHLY
            - 3MONTHLY
            - 6MONTHLY
            - QUARTERLY
            - YEARLY
            - NONE
        DefaultSalesTax:
          description: The default for LineAmountTypes on sales transactions
          type: string
        DefaultPurchasesTax:
          description: The default for LineAmountTypes on purchase transactions
          type: string
        PeriodLockDate:
          description: Shown if set. See lock dates
          type: string
          x-is-msdate: true
        EndOfYearLockDate:
          description: Shown if set. See lock dates
          type: string
          x-is-msdate: true
        CreatedDateUTC:
          description: Timestamp when the organisation was created in Xero
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        Timezone:
          $ref: '#/components/schemas/TimeZone'
          type: string
        OrganisationEntityType:
          description: Organisation Entity Type
          type: string
          enum:
            - ACCOUNTING_PRACTICE
            - COMPANY
            - CHARITY
            - CLUB_OR_SOCIETY
            - INDIVIDUAL
            - LOOK_THROUGH_COMPANY
            - NOT_FOR_PROFIT
            - PARTNERSHIP
            - S_CORPORATION
            - SELF_MANAGED_SUPERANNUATION_FUND
            - SOLE_TRADER
            - SUPERANNUATION_FUND
            - TRUST
        ShortCode:
          description: A unique identifier for the organisation. Potential uses.
          type: string
        Class:  
          description: Organisation Classes describe which plan the Xero organisation is on (e.g. DEMO, TRIAL, PREMIUM)  
          type: string  
          enum:  
          - DEMO  
          - TRIAL  
          - STARTER  
          - STANDARD  
          - PREMIUM  
          - PREMIUM_20  
          - PREMIUM_50  
          - PREMIUM_100  
          - LEDGER  
          - GST_CASHBOOK  
          - NON_GST_CASHBOOK 
          - ULTIMATE
          - LITE
          - ULTIMATE_10
          - ULTIMATE_20
          - ULTIMATE_50
          - ULTIMATE_100
          - IGNITE
          - GROW
          - COMPREHENSIVE
          - SIMPLE
        Edition:  
          description: BUSINESS or PARTNER. Partner edition organisations are sold exclusively through accounting partners and have restricted functionality (e.g. no access to invoicing)  
          type: string
          enum:
            - BUSINESS
            - PARTNER
        LineOfBusiness:
          description: Description of business type as defined in Organisation settings
          type: string
        Addresses:
          description: Address details for organisation – see Addresses
          type: array
          items:
            $ref: '#/components/schemas/AddressForOrganisation'
        Phones:
          description: Phones details for organisation – see Phones
          type: array
          items:
            $ref: '#/components/schemas/Phone'
        ExternalLinks:
          description: Organisation profile links for popular services such as Facebook,Twitter, GooglePlus and LinkedIn. You can also add link to your website here. Shown if Organisation settings  is updated in Xero. See ExternalLinks below
          type: array
          items:
            $ref: '#/components/schemas/ExternalLink'
        PaymentTerms:
          $ref: '#/components/schemas/PaymentTerm'
      type: object
    CountryCode:
      type: string
      enum:
        - AD
        - AE
        - AF
        - AG
        - AI
        - AL
        - AM
        - AN
        - AO
        - AQ
        - AR
        - AS
        - AT
        - AU
        - AW
        - AZ
        - BA
        - BB
        - BD
        - BE
        - BF
        - BG
        - BH
        - BI
        - BJ
        - BL
        - BM
        - BN
        - BO
        - BR
        - BS
        - BT
        - BW
        - BY
        - BZ
        - CA
        - CC
        - CD
        - CF
        - CG
        - CH
        - CI
        - CK
        - CL
        - CM
        - CN
        - CO
        - CR
        - CU
        - CV
        - CW
        - CX
        - CY
        - CZ
        - DE
        - DJ
        - DK
        - DM
        - DO
        - DZ
        - EC
        - EE
        - EG
        - EH
        - ER
        - ES
        - ET
        - FI
        - FJ
        - FK
        - FM
        - FO
        - FR
        - GA
        - GB
        - GD
        - GE
        - GG
        - GH
        - GI
        - GL
        - GM
        - GN
        - GQ
        - GR
        - GT
        - GU
        - GW
        - GY
        - HK
        - HN
        - HR
        - HT
        - HU
        - ID
        - IE
        - IL
        - IM
        - IN
        - IO
        - IQ
        - IR
        - IS
        - IT
        - JE
        - JM
        - JO
        - JP
        - KE
        - KG
        - KH
        - KI
        - KM
        - KN
        - KP
        - KR
        - KW
        - KY
        - KZ
        - LA
        - LB
        - LC
        - LI
        - LK
        - LR
        - LS
        - LT
        - LU
        - LV
        - LY
        - MA
        - MC
        - MD
        - ME
        - MF
        - MG
        - MH
        - MK
        - ML
        - MM
        - MN
        - MO
        - MP
        - MR
        - MS
        - MT
        - MU
        - MV
        - MW
        - MX
        - MY
        - MZ
        - NA
        - NC
        - NE
        - NG
        - NI
        - NL
        - "NO"
        - NP
        - NR
        - NU
        - NZ
        - OM
        - PA
        - PE
        - PF
        - PG
        - PH
        - PK
        - PL
        - PM
        - PN
        - PR
        - PS
        - PT
        - PW
        - PY
        - QA
        - RE
        - RO
        - RS
        - RU
        - RW
        - SA
        - SB
        - SC
        - SD
        - SE
        - SG
        - SH
        - SI
        - SJ
        - SK
        - SL
        - SM
        - SN
        - SO
        - SR
        - SS
        - ST
        - SV
        - SX
        - SY
        - SZ
        - TC
        - TD
        - TG
        - TH
        - TJ
        - TK
        - TL
        - TM
        - TN
        - TO
        - TR
        - TT
        - TV
        - TW
        - TZ
        - UA
        - UG
        - US
        - UY
        - UZ
        - VA
        - VC
        - VE
        - VG
        - VI
        - VN
        - VU
        - WF
        - WS
        - XK
        - YE
        - YT
        - ZA
        - ZM
        - ZW
    TimeZone:
      description: Timezone specifications
      type: string
      enum:
        - AFGHANISTANSTANDARDTIME
        - ALASKANSTANDARDTIME
        - ALEUTIANSTANDARDTIME
        - ALTAISTANDARDTIME
        - ARABIANSTANDARDTIME
        - ARABICSTANDARDTIME
        - ARABSTANDARDTIME
        - ARGENTINASTANDARDTIME
        - ASTRAKHANSTANDARDTIME
        - ATLANTICSTANDARDTIME
        - AUSCENTRALSTANDARDTIME
        - AUSCENTRALWSTANDARDTIME
        - AUSEASTERNSTANDARDTIME
        - AZERBAIJANSTANDARDTIME
        - AZORESSTANDARDTIME
        - BAHIASTANDARDTIME
        - BANGLADESHSTANDARDTIME
        - BELARUSSTANDARDTIME
        - BOUGAINVILLESTANDARDTIME
        - CANADACENTRALSTANDARDTIME
        - CAPEVERDESTANDARDTIME
        - CAUCASUSSTANDARDTIME
        - CENAUSTRALIASTANDARDTIME
        - CENTRALAMERICASTANDARDTIME
        - CENTRALASIASTANDARDTIME
        - CENTRALBRAZILIANSTANDARDTIME
        - CENTRALEUROPEANSTANDARDTIME
        - CENTRALEUROPESTANDARDTIME
        - CENTRALPACIFICSTANDARDTIME
        - CENTRALSTANDARDTIME
        - CENTRALSTANDARDTIME(MEXICO)
        - CHATHAMISLANDSSTANDARDTIME
        - CHINASTANDARDTIME
        - CUBASTANDARDTIME
        - DATELINESTANDARDTIME
        - EAFRICASTANDARDTIME
        - EASTERISLANDSTANDARDTIME
        - EASTERNSTANDARDTIME
        - EASTERNSTANDARDTIME(MEXICO)
        - EAUSTRALIASTANDARDTIME
        - EEUROPESTANDARDTIME
        - EGYPTSTANDARDTIME
        - EKATERINBURGSTANDARDTIME
        - ESOUTHAMERICASTANDARDTIME
        - FIJISTANDARDTIME
        - FLESTANDARDTIME
        - GEORGIANSTANDARDTIME
        - GMTSTANDARDTIME
        - GREENLANDSTANDARDTIME
        - GREENWICHSTANDARDTIME
        - GTBSTANDARDTIME
        - HAITISTANDARDTIME
        - HAWAIIANSTANDARDTIME
        - INDIASTANDARDTIME
        - IRANSTANDARDTIME
        - ISRAELSTANDARDTIME
        - JORDANSTANDARDTIME
        - KALININGRADSTANDARDTIME
        - KAMCHATKASTANDARDTIME
        - KOREASTANDARDTIME
        - LIBYASTANDARDTIME
        - LINEISLANDSSTANDARDTIME
        - LORDHOWESTANDARDTIME
        - MAGADANSTANDARDTIME
        - MAGALLANESSTANDARDTIME
        - MARQUESASSTANDARDTIME
        - MAURITIUSSTANDARDTIME
        - MIDATLANTICSTANDARDTIME
        - MIDDLEEASTSTANDARDTIME
        - MONTEVIDEOSTANDARDTIME
        - MOROCCOSTANDARDTIME
        - MOUNTAINSTANDARDTIME
        - MOUNTAINSTANDARDTIME(MEXICO)
        - MYANMARSTANDARDTIME
        - NAMIBIASTANDARDTIME
        - NCENTRALASIASTANDARDTIME
        - NEPALSTANDARDTIME
        - NEWFOUNDLANDSTANDARDTIME
        - NEWZEALANDSTANDARDTIME
        - NORFOLKSTANDARDTIME
        - NORTHASIAEASTSTANDARDTIME
        - NORTHASIASTANDARDTIME
        - NORTHKOREASTANDARDTIME
        - OMSKSTANDARDTIME
        - PACIFICSASTANDARDTIME
        - PACIFICSTANDARDTIME
        - PACIFICSTANDARDTIME(MEXICO)
        - PAKISTANSTANDARDTIME
        - PARAGUAYSTANDARDTIME
        - QYZYLORDASTANDARDTIME
        - ROMANCESTANDARDTIME
        - RUSSIANSTANDARDTIME
        - RUSSIATIMEZONE10
        - RUSSIATIMEZONE11
        - RUSSIATIMEZONE3
        - SAEASTERNSTANDARDTIME
        - SAINTPIERRESTANDARDTIME
        - SAKHALINSTANDARDTIME
        - SAMOASTANDARDTIME
        - SAOTOMESTANDARDTIME
        - SAPACIFICSTANDARDTIME
        - SARATOVSTANDARDTIME
        - SAWESTERNSTANDARDTIME
        - SEASIASTANDARDTIME
        - SINGAPORESTANDARDTIME
        - SOUTHAFRICASTANDARDTIME
        - SOUTHSUDANSTANDARDTIME
        - SRILANKASTANDARDTIME
        - SUDANSTANDARDTIME
        - SYRIASTANDARDTIME
        - TAIPEISTANDARDTIME
        - TASMANIASTANDARDTIME
        - TOCANTINSSTANDARDTIME
        - TOKYOSTANDARDTIME
        - TOMSKSTANDARDTIME
        - TONGASTANDARDTIME
        - TRANSBAIKALSTANDARDTIME
        - TURKEYSTANDARDTIME
        - TURKSANDCAICOSSTANDARDTIME
        - ULAANBAATARSTANDARDTIME
        - USEASTERNSTANDARDTIME
        - USMOUNTAINSTANDARDTIME
        - UTC
        - UTC+12
        - UTC+13
        - UTC02
        - UTC08
        - UTC09
        - UTC11
        - VENEZUELASTANDARDTIME
        - VLADIVOSTOKSTANDARDTIME
        - VOLGOGRADSTANDARDTIME
        - WAUSTRALIASTANDARDTIME
        - WCENTRALAFRICASTANDARDTIME
        - WESTASIASTANDARDTIME
        - WESTBANKSTANDARDTIME
        - WESTPACIFICSTANDARDTIME
        - WEUROPESTANDARDTIME
        - WMONGOLIASTANDARDTIME
        - YAKUTSKSTANDARDTIME
        - YUKONSTANDARDTIME
    PaymentTerm:
      externalDocs:
        url: http://developer.xero.com/documentation/api/organisation/
      properties:
        Bills:
          $ref: '#/components/schemas/Bill'
        Sales:
          $ref: '#/components/schemas/Bill'
      type: object
    PaymentTermType:
      type: string
      enum:
        - DAYSAFTERBILLDATE
        - DAYSAFTERBILLMONTH
        - OFCURRENTMONTH
        - OFFOLLOWINGMONTH
    ExternalLink:
      externalDocs:
        url: http://developer.xero.com/documentation/api/organisation/
      properties:
        LinkType:
          description: See External link types
          type: string
          enum:
            - Facebook
            - GooglePlus
            - LinkedIn
            - Twitter
            - Website
        Url:
          description: URL for service e.g. http://twitter.com/xeroapi
          type: string
        Description:
          type: string
      type: object
    Bill:
      externalDocs:
        url: http://developer.xero.com/documentation/api/organisation/
      properties:
        Day:
          description: Day of Month (0-31)
          type: integer
        Type:
          $ref: '#/components/schemas/PaymentTermType'
      type: object
    Overpayments:
      type: object
      x-objectArrayKey: overpayments
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Overpayments:
          type: array
          items:
            $ref: '#/components/schemas/Overpayment'
    Overpayment:
      externalDocs:
        url: http://developer.xero.com/documentation/api/overpayments/
      properties:
        Type:
          description: See Overpayment Types
          type: string
          enum:
            - RECEIVE-OVERPAYMENT
            - SPEND-OVERPAYMENT
            - AROVERPAYMENT
        Contact:
          $ref: '#/components/schemas/Contact'
        Date:
          description: The date the overpayment is created YYYY-MM-DD
          type: string
          x-is-msdate: true
        Status:
          description: See Overpayment Status Codes
          type: string
          enum:
            - AUTHORISED
            - PAID
            - VOIDED
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        LineItems:
          description: See Overpayment Line Items
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        SubTotal:
          description: The subtotal of the overpayment excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: The total tax on the overpayment
          type: number
          format: double
          x-is-money: true
        Total:
          description: The total of the overpayment (subtotal + total tax)
          type: number
          format: double
          x-is-money: true
        UpdatedDateUTC:
          description: UTC timestamp of last update to the overpayment
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        OverpaymentID:
          description: Xero generated unique identifier
          type: string
          format: uuid
        CurrencyRate:
          description: The currency rate for a multicurrency overpayment. If no rate is specified, the XE.com day rate is used
          type: number
          format: double
          x-is-money: true
        RemainingCredit:
          description: The remaining credit balance on the overpayment
          type: number
          format: double
          x-is-money: true
        Allocations:
          description: See Allocations
          type: array
          items:
            $ref: '#/components/schemas/Allocation'
        AppliedAmount:
          description: The amount of applied to an invoice
          type: number
          format: double
          example: 2.00
        Payments:
          description: See Payments
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        HasAttachments:
          description: boolean to indicate if a overpayment has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        Attachments:
          description: See Attachments
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
      type: object
    Payments:
      type: object
      x-objectArrayKey: payments
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Payments:
          type: array
          items:
            $ref: '#/components/schemas/Payment'
    PaymentDelete:
      externalDocs:
        url: http://developer.xero.com/documentation/api/payments/
      properties:
        Status:
          description: The status of the payment.
          type: string
          default: DELETED
      required:
        - Status
      type: object
    Payment:
      externalDocs:
        url: http://developer.xero.com/documentation/api/payments/
      properties:
        Invoice:
          $ref: '#/components/schemas/Invoice'
        CreditNote:
          $ref: '#/components/schemas/CreditNote'
        Prepayment:
          $ref: '#/components/schemas/Prepayment'
        Overpayment:
          $ref: '#/components/schemas/Overpayment'
        InvoiceNumber:
          description: Number of invoice or credit note you are applying payment to e.g.INV-4003
          type: string
        CreditNoteNumber:
          description: Number of invoice or credit note you are applying payment to e.g. INV-4003
          type: string
        BatchPayment:
          $ref: '#/components/schemas/BatchPayment'
        Account:
          $ref: '#/components/schemas/Account'
        Code:
          description: Code of account you are using to make the payment e.g. 001 (note- not all accounts have a code value)
          type: string
        Date:
          description: Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06
          type: string
          x-is-msdate: true
        CurrencyRate:
          description: Exchange rate when payment is received. Only used for non base currency invoices and credit notes e.g. 0.7500
          type: number
          format: double
          x-is-money: true
        Amount:
          description: The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00
          type: number
          format: double
          x-is-money: true
        BankAmount:
          description: The amount of the payment in the currency of the bank account.
          type: number
          format: double
          x-is-money: true
        Reference:
          description: An optional description for the payment e.g. Direct Debit
          type: string
        IsReconciled:
          description: An optional parameter for the payment. A boolean indicating whether you would like the payment to be created as reconciled when using PUT, or whether a payment has been reconciled when using GET
          type: boolean
        Status:
          description: The status of the payment.
          type: string
          enum:
            - AUTHORISED
            - DELETED
        PaymentType:
          description: See Payment Types.
          readOnly: true
          type: string
          enum:
            - ACCRECPAYMENT
            - ACCPAYPAYMENT
            - ARCREDITPAYMENT
            - APCREDITPAYMENT
            - AROVERPAYMENTPAYMENT
            - ARPREPAYMENTPAYMENT
            - APPREPAYMENTPAYMENT
            - APOVERPAYMENTPAYMENT
        UpdatedDateUTC:
          description: UTC timestamp of last update to the payment
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        PaymentID:
          description: The Xero identifier for an Payment e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        BatchPaymentID:
          description: Present if the payment was created as part of a batch.
          type: string
          format: uuid
          example: 00000000-0000-0000-0000-000000000000
        BankAccountNumber:
          description: The suppliers bank account number the payment is being made to
          type: string
        Particulars:
          description: The suppliers bank account number the payment is being made to
          type: string
        Details:
          description: The information to appear on the supplier's bank account
          type: string
        HasAccount:
          description: A boolean to indicate if a contact has an validation errors
          type: boolean
          default: "false"
          example: "false"
        HasValidationErrors:
          description: A boolean to indicate if a contact has an validation errors
          type: boolean
          default: "false"
          example: "false"
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      type: object
    Prepayments:
      type: object
      x-objectArrayKey: prepayments
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Prepayments:
          type: array
          items:
            $ref: '#/components/schemas/Prepayment'
    Prepayment:
      externalDocs:
        url: http://developer.xero.com/documentation/api/prepayments/
      properties:
        Type:
          description: See Prepayment Types
          type: string
          enum:
            - RECEIVE-PREPAYMENT
            - SPEND-PREPAYMENT
            - ARPREPAYMENT
            - APPREPAYMENT
        Contact:
          $ref: '#/components/schemas/Contact'
        Date:
          description: The date the prepayment is created YYYY-MM-DD
          type: string
          x-is-msdate: true
        Status:
          description: See Prepayment Status Codes
          type: string
          enum:
            - AUTHORISED
            - PAID
            - VOIDED
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        LineItems:
          description: See Prepayment Line Items
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        SubTotal:
          description: The subtotal of the prepayment excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: The total tax on the prepayment
          type: number
          format: double
          x-is-money: true
        Total:
          description: The total of the prepayment(subtotal + total tax)
          type: number
          format: double
          x-is-money: true
        Reference:
          description: Returns Invoice number field. Reference field isn't available.
          type: string
          readOnly: true
        UpdatedDateUTC:
          description: UTC timestamp of last update to the prepayment
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        PrepaymentID:
          description: Xero generated unique identifier
          type: string
          format: uuid
        CurrencyRate:
          description: The currency rate for a multicurrency prepayment. If no rate is specified, the XE.com day rate is used
          type: number
          format: double
          x-is-money: true
        RemainingCredit:
          description: The remaining credit balance on the prepayment
          type: number
          format: double
          x-is-money: true
        Allocations:
          description: See Allocations
          type: array
          items:
            $ref: '#/components/schemas/Allocation'
        Payments:
          description: See Payments
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        AppliedAmount:
          description: The amount of applied to an invoice
          type: number
          format: double
          example: 2.00
        HasAttachments:
          description: boolean to indicate if a prepayment has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        Attachments:
          description: See Attachments
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
      type: object
    PurchaseOrders:
      type: object
      x-objectArrayKey: purchase_orders
      properties:
        pagination:
          $ref: '#/components/schemas/Pagination'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        PurchaseOrders:
          type: array
          items:
            $ref: '#/components/schemas/PurchaseOrder'
    PurchaseOrder:
      externalDocs:
        url: http://developer.xero.com/documentation/api/purchase-orders/
      properties:
        Contact:
          $ref: '#/components/schemas/Contact'
        LineItems:
          description: See LineItems
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        Date:
          description: Date purchase order was issued – YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation
          type: string
          x-is-msdate: true
        DeliveryDate:
          description: Date the goods are to be delivered – YYYY-MM-DD
          type: string
          x-is-msdate: true
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        PurchaseOrderNumber:
          description: Unique alpha numeric code identifying purchase order (when missing will auto-generate from your Organisation Invoice Settings)
          type: string
        Reference:
          description: Additional reference number
          type: string
        BrandingThemeID:
          description: See BrandingThemes
          type: string
          format: uuid
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        Status:
          description: See Purchase Order Status Codes
          type: string
          enum:
            - DRAFT
            - SUBMITTED
            - AUTHORISED
            - BILLED
            - DELETED
        SentToContact:
          description: Boolean to set whether the purchase order should be marked as “sent”. This can be set only on purchase orders that have been approved or billed
          type: boolean
        DeliveryAddress:
          description: The address the goods are to be delivered to
          type: string
        AttentionTo:
          description: The person that the delivery is going to
          type: string
        Telephone:
          description: The phone number for the person accepting the delivery
          type: string
        DeliveryInstructions:
          description: A free text feild for instructions (500 characters max)
          type: string
        ExpectedArrivalDate:
          description: The date the goods are expected to arrive.
          type: string
          x-is-msdate: true
        PurchaseOrderID:
          description: Xero generated unique identifier for purchase order
          type: string
          format: uuid
        CurrencyRate:
          description: The currency rate for a multicurrency purchase order. If no rate is specified, the XE.com day rate is used.
          type: number
          format: double
          x-is-money: true
        SubTotal:
          description: Total of purchase order excluding taxes
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on purchase order
          readOnly: true
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of Purchase Order tax inclusive (i.e. SubTotal + TotalTax)
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalDiscount:
          description: Total of discounts applied on the purchase order line items
          readOnly: true
          type: number
          format: double
          x-is-money: true
        HasAttachments:
          description: boolean to indicate if a purchase order has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
      type: object
    Pagination:
      type: object
      properties:
        page:
          type: integer
        pageSize:
          type: integer
        pageCount:
          type: integer
        itemCount:
          type: integer
    Quotes:
      type: object
      x-objectArrayKey: quotes
      properties:
        Quotes:
          type: array
          items:
            $ref: '#/components/schemas/Quote'
    Quote:
      externalDocs:
        url: http://developer.xero.com/documentation/api/Quotes/
      properties:
        QuoteID:
          description: QuoteID GUID is automatically generated and is returned after create or GET.
          type: string
          format: uuid
        QuoteNumber:
          description: Unique alpha numeric code identifying a quote (Max Length = 255)
          maxLength: 255
          type: string
        Reference:
          description: Additional reference number
          maxLength: 4000
          type: string
        Terms:
          description: Terms of the quote
          maxLength: 4000
          type: string
        Contact:
          $ref: '#/components/schemas/Contact'
          type: string
        LineItems:
          description: See LineItems
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        Date:
          description: Date quote was issued – YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation
          type: string
          x-is-msdate: true
        DateString:
          description: Date the quote was issued (YYYY-MM-DD)
          type: string
        ExpiryDate:
          description: Date the quote expires – YYYY-MM-DD.
          type: string
          x-is-msdate: true
        ExpiryDateString:
          description: Date the quote expires – YYYY-MM-DD.
          type: string
        Status:
          $ref: '#/components/schemas/QuoteStatusCodes'
          type: string
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        CurrencyRate:
          description: The currency rate for a multicurrency quote
          type: number
          format: double
        SubTotal:
          description: Total of quote excluding taxes.
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on quote
          readOnly: true
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of Quote tax inclusive (i.e. SubTotal + TotalTax). This will be ignored if it doesn’t equal the sum of the LineAmounts
          readOnly: true
          type: number
          format: double
          x-is-money: true
        TotalDiscount:
          description: Total of discounts applied on the quote line items
          readOnly: true
          type: number
          format: double
          x-is-money: true
        Title:
          description: Title text for the quote
          type: string
          maxLength: 100
        Summary:
          description: Summary text for the quote
          type: string
          maxLength: 3000
        BrandingThemeID:
          description: See BrandingThemes
          type: string
          format: uuid
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        LineAmountTypes:
          $ref: '#/components/schemas/QuoteLineAmountTypes'
          type: string
          description: See Quote Line Amount Types
        StatusAttributeString:
          description: A string to indicate if a invoice status
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      type: object
    QuoteLineAmountTypes:
      description: Line amounts are exclusive of tax by default if you don’t specify this element. See Line Amount Types
      type: string
      enum:
        - EXCLUSIVE
        - INCLUSIVE
        - NOTAX
    QuoteStatusCodes:
      description: The status of the quote.
      type: string
      enum:
        - DRAFT
        - SENT
        - DECLINED
        - ACCEPTED
        - INVOICED
        - DELETED
    Receipts:
      type: object
      x-objectArrayKey: receipts
      properties:
        Receipts:
          type: array
          items:
            $ref: '#/components/schemas/Receipt'
    Receipt:
      externalDocs:
        url: http://developer.xero.com/documentation/api/receipts/
      properties:
        Date:
          description: Date of receipt – YYYY-MM-DD
          type: string
          x-is-msdate: true
        Contact:
          $ref: '#/components/schemas/Contact'
        LineItems:
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        User:
          $ref: '#/components/schemas/User'
        Reference:
          description: Additional reference number
          type: string
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        SubTotal:
          description: Total of receipt excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on receipt
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of receipt tax inclusive (i.e. SubTotal + TotalTax)
          type: number
          format: double
          x-is-money: true
        ReceiptID:
          description: Xero generated unique identifier for receipt
          type: string
          format: uuid
        Status:
          description: Current status of receipt – see status types
          type: string
          enum:
            - DRAFT
            - SUBMITTED
            - AUTHORISED
            - DECLINED
            - VOIDED
        ReceiptNumber:
          description: Xero generated sequence number for receipt in current claim for a given user
          readOnly: true
          type: string
        UpdatedDateUTC:
          description: Last modified date UTC format
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        HasAttachments:
          description: boolean to indicate if a receipt has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        Url:
          description: URL link to a source document – shown as “Go to [appName]” in the Xero app
          readOnly: true
          type: string
        ValidationErrors:
          description: Displays array of validation error messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Warnings:
          description: Displays array of warning messages from the API
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
      type: object
    RepeatingInvoices:
      type: object
      x-objectArrayKey: repeating_invoices
      properties:
        RepeatingInvoices:
          type: array
          items:
            $ref: '#/components/schemas/RepeatingInvoice'
    RepeatingInvoice:
      externalDocs:
        url: http://developer.xero.com/documentation/api/repeating-invoices/
      properties:
        Type:
          description: See Invoice Types
          type: string
          enum:
            - ACCPAY
            - ACCREC
        Contact:
          $ref: '#/components/schemas/Contact'
        Schedule:
          $ref: '#/components/schemas/Schedule'
        LineItems:
          description: See LineItems
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        LineAmountTypes:
          $ref: '#/components/schemas/LineAmountTypes'
          type: string
        Reference:
          description: ACCREC only – additional reference number
          type: string
        BrandingThemeID:
          description: See BrandingThemes
          type: string
          format: uuid
        CurrencyCode:
          $ref: '#/components/schemas/CurrencyCode'
          type: string
        Status:
          description: One of the following - DRAFT or AUTHORISED – See Invoice Status Codes
          type: string
          enum:
            - DRAFT
            - AUTHORISED
            - DELETED
        SubTotal:
          description: Total of invoice excluding taxes
          type: number
          format: double
          x-is-money: true
        TotalTax:
          description: Total tax on invoice
          type: number
          format: double
          x-is-money: true
        Total:
          description: Total of Invoice tax inclusive (i.e. SubTotal + TotalTax)
          type: number
          format: double
          x-is-money: true
        RepeatingInvoiceID:
          description: Xero generated unique identifier for repeating invoice template
          type: string
          format: uuid
        ID:
          description: Xero generated unique identifier for repeating invoice template
          type: string
          format: uuid
        HasAttachments:
          description: Boolean to indicate if an invoice has an attachment
          readOnly: true
          type: boolean
          default: "false"
          example: "false"
        Attachments:
          description: Displays array of attachments from the API
          type: array
          items:
            $ref: '#/components/schemas/Attachment'
        ApprovedForSending:
          description: Boolean to indicate whether the invoice has been approved for sending
          type: boolean
          default: "false"
          example: "false"
        SendCopy:
          description: Boolean to indicate whether a copy is sent to sender's email
          type: boolean
          default: "false"
          example: "false"
        MarkAsSent:
          description: Boolean to indicate whether the invoice in the Xero app displays as "sent"
          type: boolean
          default: "false"
          example: "false"
        IncludePDF:
          description: Boolean to indicate whether to include PDF attachment
          type: boolean
          default: "false"
          example: "false"
      type: object
    ReportWithRows:
      type: object
      properties:
        Reports:
          type: array
          items:
            $ref: '#/components/schemas/ReportWithRow'
    ReportWithRow:
      externalDocs:
        url: http://developer.xero.com/documentation/api/reports/
      properties:
        ReportID:
          description: ID of the Report
          type: string
        ReportName:
          description: Name of the report
          type: string
        ReportTitle:
          description: Title of the report
          type: string
        ReportType:
          description: The type of report (BalanceSheet,ProfitLoss, etc)
          type: string
        ReportTitles:
          description: Report titles array (3 to 4 strings with the report name, orgnisation name and time frame of report)
          type: array
          items:
            type: string
        ReportDate:
          description: Date of report
          type: string
        Rows:
          type: array
          items:
            $ref: '#/components/schemas/ReportRows'
        UpdatedDateUTC:
          description: Updated Date
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        Fields:
          type: array
          items:
            $ref: '#/components/schemas/ReportFields'
    ReportRows:
      type: object
      properties:
        RowType:
          $ref: '#/components/schemas/RowType'
        Title:
          type: string
        Cells:
          type: array
          items:
            $ref: '#/components/schemas/ReportCell'
        Rows:
          type: array
          items:
            $ref: '#/components/schemas/ReportRow'
    RowType:
      type: string
      enum:
        - Header
        - Section
        - Row
        - SummaryRow
    ReportRow:
      type: object
      properties:
        RowType:
          $ref: '#/components/schemas/RowType'
        Title:
          type: string
        Cells:
          type: array
          items:
            $ref: '#/components/schemas/ReportCell'
    ReportCell:
      type: object
      properties:
        Value:
          type: string
        Attributes:
          type: array
          items:
            $ref: '#/components/schemas/ReportAttribute'
    ReportAttribute:
      externalDocs:
        url: http://developer.xero.com/documentation/api/reports/
      properties:
        Id:
          type: string
        Value:
          type: string
    ReportFields:
      type: object
      properties:
        FieldID:
          type: string
        Description:
          type: string
        Value:
          type: string
    Reports:
      type: object
      x-objectArrayKey: reports
      properties:
        Reports:
          type: array
          items:
            $ref: '#/components/schemas/Report'
    Report:
      externalDocs:
        url: http://developer.xero.com/documentation/api/reports/
      properties:
        ReportName:
          description: See Prepayment Types
          type: string
        ReportType:
          description: See Prepayment Types
          type: string
          enum:
            - AgedPayablesByContact
        ReportTitle:
          description: See Prepayment Types
          type: string
        ReportDate:
          description: Date of report
          type: string
        UpdatedDateUTC:
          description: Updated Date
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        Contacts:
          type: array
          items:
            $ref: '#/components/schemas/TenNinetyNineContact'
    TenNinetyNineContact:
      properties:
        Box1:
          description: Box 1 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box2:
          description: Box 2 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box3:
          description: Box 3 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box4:
          description: Box 4 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box5:
          description: Box 5 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box6:
          description: Box 6 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box7:
          description: Box 7 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box8:
          description: Box 8 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box9:
          description: Box 9 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box10:
          description: Box 10 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box11:
          description: Box 11 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box13:
          description: Box 13 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Box14:
          description: Box 14 on 1099 Form
          type: number
          format: double
          x-is-money: true
        Name:
          description: Contact name on 1099 Form
          type: string
        FederalTaxIDType:
          description: Contact Fed Tax ID type
          type: string
        City:
          description: Contact city on 1099 Form
          type: string
        Zip:
          description: Contact zip on 1099 Form
          type: string
        State:
          description: Contact State on 1099 Form
          type: string
        Email:
          description: Contact email on 1099 Form
          type: string
        StreetAddress:
          description: Contact address on 1099 Form
          type: string
        TaxID:
          description: Contact tax id on 1099 Form
          type: string
        ContactId:
          description: Contact contact id
          type: string
          format: uuid
        LegalName:
          description: Contact legal name
          type: string
        BusinessName:
          description: Contact business name
          type: string
        FederalTaxClassification:
          description: Contact federal tax classification
          type: string
          enum:
            - SOLE_PROPRIETOR
            - PARTNERSHIP
            - TRUST_OR_ESTATE
            - NONPROFIT
            - C_CORP
            - S_CORP
            - OTHER
    Schedule:
      externalDocs:
        url: http://developer.xero.com/documentation/api/repeating-invoices/
      properties:
        Period:
          description: Integer used with the unit e.g. 1 (every 1 week), 2 (every 2 months)
          type: integer
        Unit:
          description: One of the following - WEEKLY or MONTHLY
          type: string
          enum:
            - WEEKLY
            - MONTHLY
        DueDate:
          description: Integer used with due date type e.g 20 (of following month), 31 (of current month)
          type: integer
        DueDateType:
          description: the payment terms
          type: string
          enum:
            - DAYSAFTERBILLDATE
            - DAYSAFTERBILLMONTH
            - DAYSAFTERINVOICEDATE
            - DAYSAFTERINVOICEMONTH
            - OFCURRENTMONTH
            - OFFOLLOWINGMONTH
        StartDate:
          description: Date the first invoice of the current version of the repeating schedule was generated (changes when repeating invoice is edited)
          type: string
          x-is-msdate: true
        NextScheduledDate:
          description: The calendar date of the next invoice in the schedule to be generated
          type: string
          x-is-msdate: true
        EndDate:
          description: Invoice end date – only returned if the template has an end date set
          type: string
          x-is-msdate: true
      type: object
    TaxRates:
      type: object
      x-objectArrayKey: tax_rates
      properties:
        TaxRates:
          type: array
          items:
            $ref: '#/components/schemas/TaxRate'
    TaxType:
      description: See Tax Types – can only be used on update calls
      type: string
      enum:
        - OUTPUT
        - INPUT
        - CAPEXINPUT
        - EXEMPTEXPORT
        - EXEMPTEXPENSES
        - EXEMPTCAPITAL
        - EXEMPTOUTPUT
        - INPUTTAXED
        - BASEXCLUDED
        - GSTONCAPIMPORTS
        - GSTONIMPORTS
        - NONE
        - INPUT2
        - ZERORATED
        - OUTPUT2
        - CAPEXINPUT2
        - CAPEXOUTPUT
        - CAPEXOUTPUT2
        - CAPEXSRINPUT
        - CAPEXSROUTPUT
        - ECACQUISITIONS
        - ECZRINPUT
        - ECZROUTPUT
        - ECZROUTPUTSERVICES
        - EXEMPTINPUT
        - REVERSECHARGES
        - RRINPUT
        - RROUTPUT
        - SRINPUT
        - SROUTPUT
        - ZERORATEDINPUT
        - ZERORATEDOUTPUT
        - BLINPUT
        - DSOUTPUT
        - EPINPUT
        - ES33OUTPUT
        - ESN33OUTPUT
        - IGDSINPUT2
        - IMINPUT2
        - MEINPUT
        - NRINPUT
        - OPINPUT
        - OSOUTPUT
        - TXESSINPUT
        - TXN33INPUT
        - TXPETINPUT
        - TXREINPUT
        - INPUT3
        - INPUT4
        - OUTPUT3
        - OUTPUT4
        - SROUTPUT2
        - TXCA
        - SRCAS
        - BLINPUT2
        - DRCHARGESUPPLY20
        - DRCHARGE20
        - DRCHARGESUPPLY5
        - DRCHARGE5
        - BADDEBTRELIEF
        - IGDSINPUT3
        - SROVR
        - TOURISTREFUND
        - TXRCN33
        - TXRCRE
        - TXRCESS
        - TXRCTS
        - OUTPUTY23
        - DSOUTPUTY23
        - INPUTY23
        - IMINPUT2Y23
        - IGDSINPUT2Y23
        - TXPETINPUTY23
        - TXESSINPUTY23
        - TXN33INPUTY23
        - TXREINPUTY23
        - TXCAY23
        - BADDEBTRELIEFY23
        - IGDSINPUT3Y23
        - SROVRRSY23
        - SROVRLVGY23
        - SRLVGY23
        - TXRCN33Y23
        - TXRCREY23
        - TXRCESSY23
        - TXRCTSY23
        - IM
        - IMY23
        - IMESS
        - IMESSY23
        - IMN33
        - IMN33Y23
        - IMRE
        - IMREY23
        - BADDEBTRECOVERY
        - BADDEBTRECOVERYY23
        - OUTPUTY24
        - DSOUTPUTY24
        - INPUTY24
        - IGDSINPUT2Y24
        - TXPETINPUTY24
        - TXESSINPUTY24
        - TXN33INPUTY24
        - TXREINPUTY24
        - TXCAY24
        - BADDEBTRELIEFY24
        - IGDSINPUT3Y24
        - SROVRRSY24
        - SROVRLVGY24
        - SRLVGY24
        - TXRCTSY24
        - TXRCESSY24
        - TXRCN33Y24
        - TXRCREY24
        - IMY24
        - IMESSY24
        - IMN33Y24
        - IMREY24
        - BADDEBTRECOVERYY24
        - OSOUTPUT2
        - BLINPUT3
        - BLINPUT3Y23
        - BLINPUT3Y24
    Setup:
      externalDocs:
        url: https://developer.xero.com/documentation/api-guides/conversions
      properties:
        ConversionDate:
          $ref: '#/components/schemas/ConversionDate'
        ConversionBalances:
          description: Balance supplied for each account that has a value as at the conversion date.
          type: array
          items:
            $ref: '#/components/schemas/ConversionBalances'
        Accounts:
          type: array
          items:
            $ref: '#/components/schemas/Account'
    ConversionDate:
      description: The date when the organisation starts using Xero
      type: object
      properties:
        Month:
          description: The month the organisation starts using Xero. Value is an integer between 1 and 12
          type: integer
          example: 1
        Year:
          description: The year the organisation starts using Xero. Value is an integer greater than 2006
          type: integer
          example: 2020
    ConversionBalances:
      description: Balance supplied for each account that has a value as at the conversion date.
      properties:
        AccountCode:
          description: The account code for a account
          type: string
        Balance:
          description: The opening balances of the account. Debits are positive, credits are negative values
          type: number
          format: double
        BalanceDetails:
          type: array
          items:
            $ref: '#/components/schemas/BalanceDetails'
      type: object
    BalanceDetails:
      description: An array to specify multiple currency balances of an account
      properties:
        Balance:
          description: The opening balances of the account. Debits are positive, credits are negative values
          type: number
          format: double
        CurrencyCode:
          description: The currency of the balance (Not required for base currency)
          type: string
        CurrencyRate:
          description: (Optional) Exchange rate to base currency when money is spent or received. If not specified, XE rate for the day is applied
          type: number
          format: double
          x-is-money: true
      type: object
    ImportSummaryObject:
      externalDocs:
        url: https://developer.xero.com/documentation/api-guides/conversions
      properties:
        ImportSummary:
          $ref: '#/components/schemas/ImportSummary'
    ImportSummary:
      externalDocs:
        url: https://developer.xero.com/documentation/api-guides/conversions
      description: A summary of the import from setup endpoint
      type: object
      properties:
        Accounts:
          $ref: '#/components/schemas/ImportSummaryAccounts'
        Organisation:
          $ref: '#/components/schemas/ImportSummaryOrganisation'
    ImportSummaryAccounts:
      description: A summary of the accounts changes
      type: object
      properties:
        Total:
          description: The total number of accounts in the org
          type: integer
          format: int32
        New:
          description: The number of new accounts created
          type: integer
          format: int32
        Updated:
          description: The number of accounts updated
          type: integer
          format: int32
        Deleted:
          description: The number of accounts deleted
          type: integer
          format: int32
        Locked:
          description: The number of locked accounts
          type: integer
          format: int32
        System:
          description: The number of system accounts
          type: integer
          format: int32
        Errored:
          description: The number of accounts that had an error
          type: integer
          format: int32
        Present:
          type: boolean
        NewOrUpdated:
          description: The number of new or updated accounts
          type: integer
          format: int32
    ImportSummaryOrganisation:
      type: object
      properties:
        Present:
          type: boolean
    TaxRate:
      externalDocs:
        url: http://developer.xero.com/documentation/api/tax-rates/
      properties:
        Name:
          description: Name of tax rate
          type: string
        TaxType:
          description: The tax type
          type: string
        TaxComponents:
          description: See TaxComponents
          type: array
          items:
            $ref: '#/components/schemas/TaxComponent'
        Status:
          description: See Status Codes
          type: string
          enum:
            - ACTIVE
            - DELETED
            - ARCHIVED
            - PENDING
        ReportTaxType:
          description: See ReportTaxTypes
          type: string
          enum:
            - AVALARA
            - BASEXCLUDED
            - CAPITALSALESOUTPUT
            - CAPITALEXPENSESINPUT
            - ECOUTPUT
            - ECOUTPUTSERVICES
            - ECINPUT
            - ECACQUISITIONS
            - EXEMPTEXPENSES
            - EXEMPTINPUT
            - EXEMPTOUTPUT
            - GSTONIMPORTS
            - INPUT
            - INPUTTAXED
            - MOSSSALES
            - NONE
            - NONEOUTPUT
            - OUTPUT
            - PURCHASESINPUT
            - SALESOUTPUT
            - EXEMPTCAPITAL
            - EXEMPTEXPORT
            - CAPITALEXINPUT
            - GSTONCAPIMPORTS
            - GSTONCAPITALIMPORTS
            - REVERSECHARGES
            - PAYMENTS
            - INVOICE
            - CASH
            - ACCRUAL
            - FLATRATECASH
            - FLATRATEACCRUAL
            - ACCRUALS
            - TXCA
            - SRCAS
            - DSOUTPUT
            - BLINPUT2
            - EPINPUT
            - IMINPUT2
            - MEINPUT
            - IGDSINPUT2
            - ESN33OUTPUT
            - OPINPUT
            - OSOUTPUT
            - TXN33INPUT
            - TXESSINPUT
            - TXREINPUT
            - TXPETINPUT
            - NRINPUT
            - ES33OUTPUT
            - ZERORATEDINPUT
            - ZERORATEDOUTPUT
            - DRCHARGESUPPLY
            - DRCHARGE
            - CAPINPUT
            - CAPIMPORTS
            - IMINPUT
            - INPUT2
            - CIUINPUT
            - SRINPUT
            - OUTPUT2
            - SROUTPUT
            - CAPOUTPUT
            - SROUTPUT2
            - CIUOUTPUT
            - ZROUTPUT
            - ZREXPORT
            - ACC28PLUS
            - ACCUPTO28
            - OTHEROUTPUT
            - SHOUTPUT
            - ZRINPUT
            - BADDEBT
            - OTHERINPUT
            - BADDEBTRELIEF
            - IGDSINPUT3
            - SROVR
            - TOURISTREFUND
            - TXRCN33
            - TXRCRE
            - TXRCESS
            - TXRCTS
            - CAPEXINPUT
            - UNDEFINED
            - CAPEXOUTPUT
            - ZEROEXPOUTPUT
            - GOODSIMPORT
            - NONEINPUT
            - NOTREPORTED
            - SROVRRS
            - SROVRLVG
            - SRLVG
            - IM
            - IMESS
            - IMN33
            - IMRE
            - BADDEBTRECOVERY
            - USSALESTAX
            - BLINPUT3
        CanApplyToAssets:
          description: Boolean to describe if tax rate can be used for asset accounts i.e.  true,false
          readOnly: true
          type: boolean
        CanApplyToEquity:
          description: Boolean to describe if tax rate can be used for equity accounts i.e true,false
          readOnly: true
          type: boolean
        CanApplyToExpenses:
          description: Boolean to describe if tax rate can be used for expense accounts  i.e. true,false
          readOnly: true
          type: boolean
        CanApplyToLiabilities:
          description: Boolean to describe if tax rate can be used for liability accounts  i.e. true,false
          readOnly: true
          type: boolean
        CanApplyToRevenue:
          description: Boolean to describe if tax rate can be used for revenue accounts i.e. true,false
          readOnly: true
          type: boolean
        DisplayTaxRate:
          description: Tax Rate (decimal to 4dp) e.g 12.5000
          readOnly: true
          type: number
          format: double
          x-is-money: true
        EffectiveRate:
          description: Effective Tax Rate (decimal to 4dp) e.g 12.5000
          readOnly: true
          type: number
          format: double
          x-is-money: true
      type: object
    TaxComponent:
      externalDocs:
        url: http://developer.xero.com/documentation/api/tax-rates/
      properties:
        Name:
          description: Name of Tax Component
          type: string
        Rate:
          description: Tax Rate (up to 4dp)
          type: number
          format: double
          x-is-money: true
        IsCompound:
          description: Boolean to describe if Tax rate is compounded.
          type: boolean
        IsNonRecoverable:
          description: Boolean to describe if tax rate is non-recoverable. Non-recoverable rates are only applicable to Canadian organisations
          type: boolean
      type: object
    TrackingCategories:
      type: object
      x-objectArrayKey: tracking_categories
      properties:
        TrackingCategories:
          type: array
          items:
            $ref: '#/components/schemas/TrackingCategory'
    TrackingCategory:
      externalDocs:
        url: http://developer.xero.com/documentation/api/tracking-categories/
      properties:
        TrackingCategoryID:
          description: The Xero identifier for a tracking category e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
        TrackingOptionID:
          description: The Xero identifier for a tracking option e.g. dc54c220-0140-495a-b925-3246adc0075f
          type: string
          format: uuid
        Name:
          description: The name of the tracking category e.g. Department, Region (max length = 100)
          maxLength: 100
          type: string
        Option:
          description: The option name of the tracking option e.g. East, West (max length = 100)
          maxLength: 100
          type: string
        Status:
          description: The status of a tracking category
          type: string
          enum:
            - ACTIVE
            - ARCHIVED
            - DELETED
        Options:
          description: See Tracking Options
          type: array
          items:
            $ref: '#/components/schemas/TrackingOption'
      type: object
    TrackingOptions:
      type: object
      x-objectArrayKey: options
      properties:
        Options:
          type: array
          items:
            $ref: '#/components/schemas/TrackingOption'
    TrackingOption:
      externalDocs:
        url: http://developer.xero.com/documentation/api/tracking-categories/
      properties:
        TrackingOptionID:
          description: The Xero identifier for a tracking option e.g. ae777a87-5ef3-4fa0-a4f0-d10e1f13073a
          type: string
          format: uuid
        Name:
          description: The name of the tracking option e.g. Marketing, East (max length = 100)
          maxLength: 100
          type: string
        Status:
          description: The status of a tracking option
          type: string
          enum:
            - ACTIVE
            - ARCHIVED
            - DELETED
        TrackingCategoryID:
          description: Filter by a tracking category e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9
          type: string
          format: uuid
      type: object
    SalesTrackingCategory:
      externalDocs:
        url: http://developer.xero.com/documentation/api/tracking-categories/
      properties:
        TrackingCategoryName:
          description: The default sales tracking category name for contacts
          type: string
        TrackingOptionName:
          description: The default purchase tracking category name for contacts
          type: string
      type: object
    Users:
      type: object
      x-objectArrayKey: users
      properties:
        Users:
          type: array
          items:
            $ref: '#/components/schemas/User'
    User:
      externalDocs:
        url: http://developer.xero.com/documentation/api/users/
      properties:
        UserID:
          description: Xero identifier
          type: string
          format: uuid
        EmailAddress:
          description: Email address of user
          type: string
        FirstName:
          description: First name of user
          type: string
        LastName:
          description: Last name of user
          type: string
        UpdatedDateUTC:
          description: Timestamp of last change to user
          type: string
          x-is-msdate-time: true
          example: /Date(1573755038314)/
          readOnly: true
        IsSubscriber:
          description: Boolean to indicate if user is the subscriber
          type: boolean
        OrganisationRole:
          description: User role that defines permissions in Xero and via API (READONLY, INVOICEONLY, STANDARD, FINANCIALADVISER, etc)
          type: string
          enum:
            - READONLY
            - INVOICEONLY
            - STANDARD
            - FINANCIALADVISER
            - MANAGEDCLIENT
            - CASHBOOKCLIENT
            - UNKNOWN
            - REMOVED
      type: object
    Error:
      externalDocs:
        url: https://developer.xero.com/documentation/api/http-response-codes
      properties:
        ErrorNumber:
          description: Exception number
          type: integer
        Type:
          description: Exception type
          type: string
        Message:
          description: Exception message
          type: string
        Elements:
          description: Array of Elements of validation Errors
          type: array
          items:
            $ref: '#/components/schemas/Element'
      type: object
    Element:
      externalDocs:
        url: https://developer.xero.com/documentation/api/http-response-codes
      properties:
        ValidationErrors:
          description: Array of Validation Error message
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
        BatchPaymentID:
          description: Unique ID for batch payment object with validation error
          type: string
          format: uuid
        BankTransactionID:
          type: string
          format: uuid
        CreditNoteID:
          type: string
          format: uuid
        ContactID:
          type: string
          format: uuid
        InvoiceID:
          type: string
          format: uuid
        ItemID:
          type: string
          format: uuid
        PurchaseOrderID:
          type: string
          format: uuid
      type: object
    ValidationError:
      externalDocs:
        url: https://developer.xero.com/documentation/api/http-response-codes
      properties:
        Message:
          description: Validation error message
          type: string
      type: object
    InvoiceAddress:
      properties:
        InvoiceAddressType:
          description: Indicates whether the address is defined as origin (FROM) or destination (TO)
          type: string
          enum:
            - FROM
            - TO
        AddressLine1:
          description: First line of a physical address
          type: string
        AddressLine2:
          description: Second line of a physical address
          type: string
        AddressLine3:
          description: Third line of a physical address
          type: string
        AddressLine4:
          description: Fourth line of a physical address
          type: string
        City:
          description: City of a physical address
          type: string
        Region:
          description: Region or state of a physical address
          type: string
        PostalCode:
          description: Postal code of a physical address
          type: string
        Country:
          description: Country of a physical address
          type: string
      type: object
    TaxBreakdownComponent:
      properties:
        TaxComponentId:
          description: The unique ID number of this component
          type: string
          format: uuid
        Type:
          description: The type of the jurisdiction
          type: string
          enum:
            - SYSGST/USCOUNTRY
            - SYSGST/USSTATE
            - SYSGST/USCOUNTY
            - SYSGST/USCITY
            - SYSGST/USSPECIAL
        Name:
          description: The name of the jurisdiction
          type: string
        TaxPercentage:
          description: The percentage of the tax
          type: number
        TaxAmount:
          description: The amount of the tax
          type: number
        TaxableAmount:
          description: The amount that is taxable
          type: number
        NonTaxableAmount:
          description: The amount that is not taxable
          type: number
        ExemptAmount:
          description: The amount that is exempt
          type: number
        StateAssignedNo:
          description: The state assigned number of the jurisdiction
          type: string
        JurisdictionRegion:
          description: Name identifying the region within the country
          type: string
      type: object
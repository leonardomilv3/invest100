package br.com.investidor100.architecture.fixtures.ledger.application;

import br.com.investidor100.architecture.fixtures.cards.application.ResolveInvoice;
import br.com.investidor100.architecture.fixtures.cards.domain.event.InvoicePaid;
import br.com.investidor100.architecture.fixtures.ledger.domain.Transaction;

public class RegisterExpense {
    Transaction transaction;
    ResolveInvoice resolveInvoice;
    InvoicePaid event;

    public record Command(String description) {}
}

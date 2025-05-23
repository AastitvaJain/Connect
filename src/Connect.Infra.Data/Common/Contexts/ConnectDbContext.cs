using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Connect;

public class ConnectDbContext(DbContextOptions<ConnectDbContext> options) : DbContext(options)
{
    public DbSet<AccountDao> Accounts { get; set; }
    public DbSet<ChannelPartnerDao> ChannelPartners { get; set; }
    
    public DbSet<SoldInventoryDao> SoldInventory { get; set; }
    
    public DbSet<NewInventoryDao> NewInventory { get; set; }
    
    public DbSet<ClientDao> Clients { get; set; }
    
    public DbSet<PropertyRecordDao> PropertyRecords { get; set; }
    
    public DbSet<ClientPaymentDao> ClientPayments { get; set; }
    
    public DbSet<ProjectOfferDao> ProjectOffer { get; set; }
    
    public DbSet<NewLeadDao> NewLeads { get; set; }

    public DbSet<ApproveRequestDao> ApproveRequests { get; set; }
    
    public DbSet<ApprovalPropertyRecordDao> ApprovalPropertyRecords { get; set; }
    
    public IQueryable<T> ReadOnlySet<T>() where T : class =>
        Set<T>().AsNoTracking();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountDao>(entity =>
        {
            entity.ToTable("account");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.EmailId)
                .HasColumnName("email_id")
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(e => e.EmailId)
                .IsUnique();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(e => e.Group)
                .HasColumnName("group")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.State)
                .HasColumnName("state")
                .HasConversion<string>()
                .IsRequired();

            entity.OwnsOne(e => e.Password, pw =>
            {
                pw.Property(p => p.Salt).HasColumnName("password_salt").IsRequired();
                pw.Property(p => p.Hash).HasColumnName("password_hash").IsRequired();
                pw.Property(p => p.IterationCount).HasColumnName("password_iterations").IsRequired();
                pw.Property(p => p.UpdateTime).HasColumnName("password_updated").IsRequired();
            });

            entity.OwnsOne(e => e.Auth, auth =>
            {
                auth.Property(a => a.Token).HasColumnName("auth_token").IsRequired();
                auth.Property(a => a.CreateTime).HasColumnName("auth_created").IsRequired();
            });
        });

        modelBuilder.Entity<ChannelPartnerDao>(entity =>
        {
            entity.ToTable("channel_partner");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();
        });

        modelBuilder.Entity<SoldInventoryDao>(entity =>
        {
            entity.ToTable("sold_inventory");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");
            
            entity.Property(e => e.SrNo)
                .HasColumnName("sr_no")
                .HasMaxLength(255);

            entity.Property(e => e.BookingId)
                .HasColumnName("booking_id")
                .HasMaxLength(255);
            
            entity.Property(e => e.BookingDate)
                .HasColumnName("booking_date")
                .HasMaxLength(255);
            
            entity.Property(e => e.PropertyId)
                .HasColumnName("property_id")
                .HasMaxLength(10)
                .IsRequired();
            
            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.ProjectType)
                .HasColumnName("project_type")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.UnitNo)
                .HasColumnName("unit_no")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.UnitCategory)
                .HasColumnName("unit_category")
                .HasMaxLength(255);
            
            entity.Property(e => e.BuyerName)
                .HasColumnName("buyer_name")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.BuiltUpArea)
                .HasColumnName("built_up_area")
                .IsRequired();
            
            entity.Property(e => e.Rate)
                .HasColumnName("rate")
                .IsRequired();
            
            entity.Property(e => e.TotalConsideration)
                .HasColumnName("total_consideration")
                .IsRequired();
            
            entity.Property(e => e.NetReceived)
                .HasColumnName("net_received")
                .IsRequired();
            
            entity.Property(e => e.AssuredPrice)
                .HasColumnName("assured_price")
                .HasMaxLength(255);

            entity.Property(e => e.Discount)
                .HasColumnName("discount");
        });
        
        modelBuilder.Entity<NewInventoryDao>(entity =>
        {
            entity.ToTable("new_inventory");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()"); // PostgresSQL UUID generation

            entity.Property(e => e.PropertyId)
                .HasColumnName("property_id")
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.ProjectType)
                .HasColumnName("project_type")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.UnitNo)
                .HasColumnName("unit_no")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.BuiltUpArea)
                .HasColumnName("built_up_area")
                .IsRequired();

            entity.Property(e => e.Rate)
                .HasColumnName("rate")
                .IsRequired();

            entity.Property(e => e.TotalConsideration)
                .HasColumnName("total_consideration")
                .IsRequired();

            entity.Property(e => e.BookingAmount)
                .HasColumnName("booking_amount");

            entity.Property(e => e.Premium)
                .HasColumnName("premium");
        });
        
        modelBuilder.Entity<ClientDao>(entity =>
        {
            entity.ToTable("client");

            entity.HasKey(e => new { e.Id, e.Sequence });

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.Sequence)
                .HasColumnName("sequence")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue:100000, maxValue:999999);
            
            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.EmailId)
                .HasColumnName("email_id")
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNo)
                .HasColumnName("phone_no")
                .HasMaxLength(255);

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by");
            
            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");
            
            entity.Property(e => e.IsSubmitted)
                .HasColumnName("is_submitted")
                .IsRequired();

            // One-to-many SellRecords
            entity.HasMany(e => e.SellRecords)
                .WithOne(e => e.Seller)
                .HasForeignKey(e => new { e.SellerId, e.SellerSequence })
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many BuyRecords
            entity.HasMany(e => e.BuyRecords)
                .WithOne(e => e.Buyer)
                .HasForeignKey(e => new { e.BuyerId, e.BuyerSequence })
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-one ClientPayment
            entity.HasOne(e => e.ClientPayment)
                .WithOne(e => e.Client)
                .HasForeignKey<ClientPaymentDao>(e => new { e.ClientId, e.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.CreatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.UpdatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.ApproveRequests)
                .WithOne(e => e.Client)
                .HasForeignKey(e => new { e.ClientId, e.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<PropertyRecordDao>(entity =>
        {
            entity.ToTable("property_record");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.PropertyRecordId)
                .HasColumnName("property_record_id")
                .IsRequired();

            entity.Property(e => e.OriginalRate)
                .HasColumnName("original_rate")
                .IsRequired();

            entity.Property(e => e.DraftRate)
                .HasColumnName("draft_rate");
            
            entity.Property(e => e.RequestedRate)
                .HasColumnName("requested_rate");

            entity.Property(e => e.ApprovedRate)
                .HasColumnName("approved_rate");

            entity.Property(e => e.PaymentPlan)
                .HasColumnName("payment_plan")
                .HasMaxLength(5000);
            
            entity.Property(e => e.SellerId)
                .HasColumnName("seller_id");
            
            entity.Property(e => e.SellerSequence)
                .HasColumnName("seller_sequence");
            
            entity.Property(e => e.BuyerId)
                .HasColumnName("buyer_id");
            
            entity.Property(e => e.BuyerSequence)
                .HasColumnName("buyer_sequence");
            
            entity.Property(e => e.NewLeadId)
                .HasColumnName("new_lead_id");

            // Seller (one-to-many)
            entity.HasOne(e => e.Seller)
                .WithMany(c => c.SellRecords)
                .HasForeignKey(e => new { e.SellerId, e.SellerSequence })
                .OnDelete(DeleteBehavior.Cascade);

            // Buyer (one-to-many)
            entity.HasOne(e => e.Buyer)
                .WithMany(c => c.BuyRecords)
                .HasForeignKey(e => new { e.BuyerId, e.BuyerSequence })
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.NewLead)
                .WithMany(c => c.SellRecords)
                .HasForeignKey(e => e.NewLeadId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ClientPaymentDao>(entity =>
        {
            entity.ToTable("client_payment");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()"); // PostgreSQL UUID generation

            entity.Property(e => e.AmountPaid)
                .HasColumnName("amount_paid")
                .IsRequired();

            entity.Property(e => e.PaymentMode)
                .HasColumnName("payment_mode")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.PaymentId)
                .HasColumnName("payment_id")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.TotalBuyAmount)
                .HasColumnName("total_buy_amount")
                .IsRequired();
            
            entity.Property(e => e.TotalSellAmount)
                .HasColumnName("total_sell_amount")
                .IsRequired();

            entity.Property(e => e.ClientId)
                .HasColumnName("client_id")
                .IsRequired();

            entity.Property(e => e.ClientSequence)
                .HasColumnName("client_sequence")
                .IsRequired();

            entity.Property(e => e.ChannelPartnerId)
                .HasColumnName("channel_partner_id")
                .HasMaxLength(255);

            entity.Property(e => e.CustomChannelPartnerName)
                .HasColumnName("custom_channel_partner_name")
                .HasMaxLength(255);

            entity.Property(e => e.CustomChannelPartnerNumber)
                .HasColumnName("custom_channel_partner_number")
                .HasMaxLength(255);

            entity.HasOne(p => p.Client)
                .WithOne(c => c.ClientPayment)
                .HasForeignKey<ClientPaymentDao>(p => new { p.ClientId, p.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProjectOfferDao>(entity =>
        {
            entity.ToTable("project_offer");

            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasMaxLength(10);

            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.OfferAmount)
                .HasColumnName("offer_amount");
            
            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by");
            
            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");
            
            entity.HasOne(e => e.UpdatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<NewLeadDao>(entity =>
        {
            entity.ToTable("new_lead");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");
            
            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.LeadStatus)
                .HasColumnName("lead_status")
                .HasMaxLength(255);

            entity.Property(e => e.InterestedProject)
                .HasColumnName("interested_project")
                .HasMaxLength(255);

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by");

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.HasOne(e => e.CreatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UpdatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.SellRecords)
                .WithOne(e => e.NewLead)
                .HasForeignKey(e => e.NewLeadId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<ApproveRequestDao>(entity =>
        {
            entity.ToTable("approve_request");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("Id")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue:100000);

            entity.Property(e => e.ClientId)
                .HasColumnName("client_id")
                .IsRequired();

            entity.Property(e => e.ClientSequence)
                .HasColumnName("client_sequence")
                .IsRequired();

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.IsApplied)
                .HasColumnName("is_applied");

            entity.Property(e => e.Note)
                .HasColumnName("note")
                .HasMaxLength(1000);

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");
            
            entity.HasMany(e => e.SellPropertyChanges)
                .WithOne(e => e.SellApproveRequest)
                .HasForeignKey(e => e.SellApproveRequestId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasMany(e => e.BuyPropertyChanges)
                .WithOne(e => e.BuyApproveRequest)
                .HasForeignKey(e => e.BuyApproveRequestId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasMany(e => e.CostSheets)
                .WithOne(e => e.ApproveRequest)
                .HasForeignKey(e => e.ApproveRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CreatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UpdatedByAccount)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Client)
                .WithMany(c => c.ApproveRequests)
                .HasForeignKey(e => new { e.ClientId, e.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ApprovalPropertyRecordDao>(entity =>
        {
            entity.ToTable("approval_property_record");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("Id")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue: 100000);

            entity.Property(e => e.PropertyRecordId)
                .HasColumnName("property_record_id")
                .IsRequired();

            entity.Property(e => e.OriginalRate)
                .HasColumnName("original_rate")
                .IsRequired();

            entity.Property(e => e.ProposedRate)
                .HasColumnName("proposed_rate");

            entity.Property(e => e.SellApproveRequestId)
                .HasColumnName("sell_approve_request_id");
            
            entity.Property(e => e.BuyApproveRequestId)
                .HasColumnName("buy_approve_request_id");
            
            entity.HasOne(e => e.SellApproveRequest)
                .WithMany(e => e.SellPropertyChanges)
                .HasForeignKey(e => e.SellApproveRequestId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.BuyApproveRequest)
                .WithMany(e => e.BuyPropertyChanges)
                .HasForeignKey(e => e.BuyApproveRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ApprovalCostSheetDao>(entity =>
        {
            entity.ToTable("approval_cost_sheet");
            
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("Id")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue: 100000);
            
            entity.Property(e => e.ApproveRequestId)
                .HasColumnName("approve_request_id")
                .IsRequired();

            entity.Property(e => e.PropertyRecordId)
                .HasColumnName("property_record_id")
                .IsRequired();
            
            entity.HasMany(e => e.Items)
                .WithOne(e => e.CostSheet)
                .HasForeignKey(e => e.CostSheetId)
                .OnDelete(DeleteBehavior.Cascade);
                
        });

        modelBuilder.Entity<ApprovalCostSheetItemDao>(entity =>
        {
            entity.ToTable("approval_cost_sheet_item");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("Id")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue: 100000);

            entity.Property(e => e.CostSheetId)
                .HasColumnName("cost_sheet_id")
                .IsRequired();

            entity.Property(e => e.Particular)
                .HasColumnName("particular")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.PaymentPercentage)
                .HasColumnName("payment_percentage");

            entity.Property(e => e.TotalPaymentWithoutTax)
                .HasColumnName("total_payment_without_tax");

            entity.Property(e => e.FtAdjustment)
                .HasColumnName("ft_adjustment");

            entity.Property(e => e.DiscountAdjustment)
                .HasColumnName("discount_adjustment");

            entity.Property(e => e.NetPayableByCustomer)
                .HasColumnName("net_payable_by_customer");

            entity.Property(e => e.GstPayable)
                .HasColumnName("gst_payable");

            entity.Property(e => e.Sequence)
                .HasColumnName("sequence")
                .IsRequired();
            
            entity.HasOne(e => e.CostSheet)
                .WithMany(e => e.Items)
                .HasForeignKey(e => e.CostSheetId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                continue;

            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.CreatedAt))
                .HasColumnName("created_at");

            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.UpdatedAt))
                .HasColumnName("updated_at");
        }
    }

    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = now;

            entry.Entity.UpdatedAt = now;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}